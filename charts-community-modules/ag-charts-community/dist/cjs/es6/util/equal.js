"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areArrayNumbersEqual = exports.areArrayItemsStrictlyEqual = void 0;
function areArrayItemsStrictlyEqual(arrA, arrB) {
    return (arrA.length === arrB.length &&
        arrA.every((a, i) => {
            const b = arrB[i];
            if (Array.isArray(a) && Array.isArray(b)) {
                return areArrayItemsStrictlyEqual(a, b);
            }
            return a === b;
        }));
}
exports.areArrayItemsStrictlyEqual = areArrayItemsStrictlyEqual;
function areArrayNumbersEqual(arrA, arrB) {
    return arrA.length === arrB.length && arrA.every((item, i) => Number(item) === Number(arrB[i]));
}
exports.areArrayNumbersEqual = areArrayNumbersEqual;
