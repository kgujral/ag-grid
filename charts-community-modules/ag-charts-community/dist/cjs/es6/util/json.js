"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonWalk = exports.jsonApply = exports.jsonMerge = exports.DELETE = exports.jsonDiff = void 0;
const logger_1 = require("./logger");
/**
 * Performs a JSON-diff between a source and target JSON structure.
 *
 * On a per property basis, takes the target property value where:
 * - types are different.
 * - type is primitive.
 * - type is array and length or content have changed.
 *
 * Recurses for object types.
 *
 * @param source starting point for diff
 * @param target target for diff vs. source
 *
 * @returns `null` if no differences, or an object with the subset of properties that have changed.
 */
function jsonDiff(source, target) {
    const sourceType = classify(source);
    const targetType = classify(target);
    if (targetType === 'array') {
        const targetArray = target;
        if (sourceType !== 'array' || source.length !== targetArray.length) {
            return [...targetArray];
        }
        if (targetArray.some((targetElement, i) => { var _a; return jsonDiff((_a = source) === null || _a === void 0 ? void 0 : _a[i], targetElement) != null; })) {
            return [...targetArray];
        }
        return null;
    }
    if (targetType === 'primitive') {
        if (sourceType !== 'primitive') {
            return Object.assign({}, target);
        }
        if (source !== target) {
            return target;
        }
        return null;
    }
    const lhs = source || {};
    const rhs = target || {};
    const allProps = new Set([...Object.keys(lhs), ...Object.keys(rhs)]);
    let propsChangedCount = 0;
    const result = {};
    for (const prop of allProps) {
        // Cheap-and-easy equality check.
        if (lhs[prop] === rhs[prop]) {
            continue;
        }
        const take = (v) => {
            result[prop] = v;
            propsChangedCount++;
        };
        const lhsType = classify(lhs[prop]);
        const rhsType = classify(rhs[prop]);
        if (lhsType !== rhsType) {
            // Types changed, just take RHS.
            take(rhs[prop]);
            continue;
        }
        if (rhsType === 'primitive' || rhsType === null) {
            take(rhs[prop]);
            continue;
        }
        if (rhsType === 'array' && lhs[prop].length !== rhs[prop].length) {
            // Arrays are different sizes, so just take target array.
            take(rhs[prop]);
            continue;
        }
        if (rhsType === 'class-instance') {
            // Don't try to do anything tricky with array diffs!
            take(rhs[prop]);
            continue;
        }
        if (rhsType === 'function' && lhs[prop] !== rhs[prop]) {
            take(rhs[prop]);
            continue;
        }
        const diff = jsonDiff(lhs[prop], rhs[prop]);
        if (diff !== null) {
            take(diff);
        }
    }
    return propsChangedCount === 0 ? null : result;
}
exports.jsonDiff = jsonDiff;
/**
 * Special value used by `jsonMerge` to signal that a property should be removed from the merged
 * output.
 */
exports.DELETE = Symbol('<delete-property>');
const NOT_SPECIFIED = Symbol('<unspecified-property>');
/**
 * Merge together the provide JSON object structures, with the precedence of application running
 * from higher indexes to lower indexes.
 *
 * Deep-clones all objects to avoid mutation of the inputs changing the output object. For arrays,
 * just performs a deep-clone of the entire array, no merging of elements attempted.
 *
 * @param json all json objects to merge
 * @param opts merge options
 * @param opts.avoidDeepClone contains a list of properties where deep clones should be avoided
 *
 * @returns the combination of all of the json inputs
 */
function jsonMerge(json, opts) {
    var _a;
    const avoidDeepClone = (_a = opts === null || opts === void 0 ? void 0 : opts.avoidDeepClone) !== null && _a !== void 0 ? _a : [];
    const jsonTypes = json.map((v) => classify(v));
    if (jsonTypes.some((v) => v === 'array')) {
        // Clone final array.
        const finalValue = json[json.length - 1];
        if (finalValue instanceof Array) {
            return finalValue.map((v) => {
                const type = classify(v);
                if (type === 'array')
                    return jsonMerge([[], v], opts);
                if (type === 'object')
                    return jsonMerge([{}, v], opts);
                return v;
            });
        }
        return finalValue;
    }
    const result = {};
    const props = new Set(json.map((v) => (v != null ? Object.keys(v) : [])).reduce((r, n) => r.concat(n), []));
    for (const nextProp of props) {
        const values = json
            .map((j) => {
            if (j != null && typeof j === 'object' && nextProp in j) {
                return j[nextProp];
            }
            return NOT_SPECIFIED;
        })
            .filter((v) => v !== NOT_SPECIFIED);
        if (values.length === 0) {
            continue;
        }
        const lastValue = values[values.length - 1];
        if (lastValue === exports.DELETE) {
            continue;
        }
        const types = values.map((v) => classify(v));
        const type = types[0];
        if (types.some((t) => t !== type)) {
            // Short-circuit if mismatching types.
            result[nextProp] = lastValue;
            continue;
        }
        if ((type === 'array' || type === 'object') && !avoidDeepClone.includes(nextProp)) {
            result[nextProp] = jsonMerge(values, opts);
        }
        else if (type === 'array') {
            // Arrays need to be shallow copied to avoid external mutation and allow jsonDiff to
            // detect changes.
            result[nextProp] = [...lastValue];
        }
        else {
            // Just directly assign/overwrite.
            result[nextProp] = lastValue;
        }
    }
    return result;
}
exports.jsonMerge = jsonMerge;
/**
 * Recursively apply a JSON object into a class-hierarchy, optionally instantiating certain classes
 * by property name.
 *
 * @param target to apply source JSON properties into
 * @param source to be applied
 * @param params.path path for logging/error purposes, to aid with pinpointing problems
 * @param params.matcherPath path for pattern matching, to lookup allowedTypes override.
 * @param params.skip property names to skip from the source
 * @param params.constructors dictionary of property name to class constructors for properties that
 *                            require object construction
 * @param params.constructedArrays map stores arrays which items should be initialised
 *                                 using a class constructor
 * @param params.allowedTypes overrides by path for allowed property types
 */
function jsonApply(target, source, params = {}) {
    var _a, _b, _c;
    const { path = undefined, matcherPath = path ? path.replace(/(\[[0-9+]+\])/i, '[]') : undefined, skip = [], constructors = {}, constructedArrays = new WeakMap(), allowedTypes = {}, idx, } = params;
    if (target == null) {
        throw new Error(`AG Charts - target is uninitialised: ${path !== null && path !== void 0 ? path : '<root>'}`);
    }
    if (source == null) {
        return target;
    }
    const targetAny = target;
    if (idx != null && '_declarationOrder' in targetAny) {
        targetAny['_declarationOrder'] = idx;
    }
    const targetType = classify(target);
    for (const property in source) {
        const propertyMatcherPath = `${matcherPath ? matcherPath + '.' : ''}${property}`;
        if (skip.indexOf(propertyMatcherPath) >= 0) {
            continue;
        }
        const newValue = source[property];
        const propertyPath = `${path ? path + '.' : ''}${property}`;
        const targetClass = targetAny.constructor;
        const currentValue = targetAny[property];
        let ctr = (_a = constructors[propertyMatcherPath]) !== null && _a !== void 0 ? _a : constructors[property];
        try {
            const currentValueType = classify(currentValue);
            const newValueType = classify(newValue);
            if (targetType === 'class-instance' &&
                !(property in target || Object.prototype.hasOwnProperty.call(targetAny, property))) {
                logger_1.Logger.warn(`unable to set [${propertyPath}] in ${targetClass === null || targetClass === void 0 ? void 0 : targetClass.name} - property is unknown`);
                continue;
            }
            const allowableTypes = (_b = allowedTypes[propertyMatcherPath]) !== null && _b !== void 0 ? _b : [currentValueType];
            if (currentValueType === 'class-instance' && newValueType === 'object') {
                // Allowed, this is the common case! - do not error.
            }
            else if (currentValueType != null && newValueType != null && !allowableTypes.includes(newValueType)) {
                logger_1.Logger.warn(`unable to set [${propertyPath}] in ${targetClass === null || targetClass === void 0 ? void 0 : targetClass.name} - can't apply type of [${newValueType}], allowed types are: [${allowableTypes}]`);
                continue;
            }
            if (newValueType === 'array') {
                ctr = (_c = ctr !== null && ctr !== void 0 ? ctr : constructedArrays.get(currentValue)) !== null && _c !== void 0 ? _c : constructors[`${propertyMatcherPath}[]`];
                if (ctr != null) {
                    const newValueArray = newValue;
                    targetAny[property] = newValueArray.map((v, idx) => jsonApply(new ctr(), v, Object.assign(Object.assign({}, params), { path: propertyPath, matcherPath: propertyMatcherPath + '[]', idx })));
                }
                else {
                    targetAny[property] = newValue;
                }
            }
            else if (newValueType === 'class-instance') {
                targetAny[property] = newValue;
            }
            else if (newValueType === 'object') {
                if (currentValue != null) {
                    jsonApply(currentValue, newValue, Object.assign(Object.assign({}, params), { path: propertyPath, matcherPath: propertyMatcherPath, idx: undefined }));
                }
                else if (ctr != null) {
                    targetAny[property] = jsonApply(new ctr(), newValue, Object.assign(Object.assign({}, params), { path: propertyPath, matcherPath: propertyMatcherPath, idx: undefined }));
                }
                else {
                    targetAny[property] = newValue;
                }
            }
            else {
                targetAny[property] = newValue;
            }
        }
        catch (error) {
            logger_1.Logger.warn(`unable to set [${propertyPath}] in [${targetClass === null || targetClass === void 0 ? void 0 : targetClass.name}]; nested error is: ${error.message}`);
            continue;
        }
    }
    return target;
}
exports.jsonApply = jsonApply;
/**
 * Walk the given JSON object graphs, invoking the visit() callback for every object encountered.
 * Arrays are descended into without a callback, however their elements will have the visit()
 * callback invoked if they are objects.
 *
 * @param json to traverse
 * @param visit callback for each non-primitive and non-array object found
 * @param opts.skip property names to skip when walking
 * @param jsons to traverse in parallel
 */
function jsonWalk(json, visit, opts, ...jsons) {
    var _a;
    const jsonType = classify(json);
    const skip = (_a = opts.skip) !== null && _a !== void 0 ? _a : [];
    if (jsonType === 'array') {
        json.forEach((element, index) => {
            jsonWalk(element, visit, opts, ...(jsons !== null && jsons !== void 0 ? jsons : []).map((o) => o === null || o === void 0 ? void 0 : o[index]));
        });
        return;
    }
    else if (jsonType !== 'object') {
        return;
    }
    visit(jsonType, json, ...jsons);
    for (const property in json) {
        if (skip.indexOf(property) >= 0) {
            continue;
        }
        const value = json[property];
        const otherValues = jsons === null || jsons === void 0 ? void 0 : jsons.map((o) => o === null || o === void 0 ? void 0 : o[property]);
        const valueType = classify(value);
        if (valueType === 'object' || valueType === 'array') {
            jsonWalk(value, visit, opts, ...otherValues);
        }
    }
}
exports.jsonWalk = jsonWalk;
const isBrowser = typeof window !== 'undefined';
/**
 * Classify the type of a value to assist with handling for merge purposes.
 */
function classify(value) {
    if (value == null) {
        return null;
    }
    else if (isBrowser && value instanceof HTMLElement) {
        return 'primitive';
    }
    else if (value instanceof Array) {
        return 'array';
    }
    else if (value instanceof Date) {
        return 'primitive';
    }
    else if (typeof value === 'object' && value.constructor === Object) {
        return 'object';
    }
    else if (typeof value === 'function') {
        return 'function';
    }
    else if (typeof value === 'object' && value.constructor != null) {
        return 'class-instance';
    }
    return 'primitive';
}
