"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryAxis = void 0;
const validation_1 = require("../../util/validation");
const bandScale_1 = require("../../scale/bandScale");
const cartesianAxis_1 = require("./cartesianAxis");
class CategoryAxis extends cartesianAxis_1.CartesianAxis {
    constructor(moduleCtx) {
        super(moduleCtx, new bandScale_1.BandScale());
        this._paddingOverrideEnabled = false;
        this.groupPaddingInner = 0.1;
        this.includeInvisibleDomains = true;
    }
    set paddingInner(value) {
        this._paddingOverrideEnabled = true;
        this.scale.paddingInner = value;
    }
    get paddingInner() {
        this._paddingOverrideEnabled = true;
        return this.scale.paddingInner;
    }
    set paddingOuter(value) {
        this.scale.paddingOuter = value;
    }
    get paddingOuter() {
        return this.scale.paddingOuter;
    }
    normaliseDataDomain(d) {
        var _a;
        var _b;
        // Prevent duplicate categories.
        const valuesSet = {};
        for (const next of d) {
            (_a = valuesSet[_b = String(next)]) !== null && _a !== void 0 ? _a : (valuesSet[_b] = next);
        }
        return Object.values(valuesSet);
    }
    calculateDomain() {
        if (!this._paddingOverrideEnabled) {
            const { boundSeries } = this;
            const paddings = boundSeries.map((s) => { var _a; return (_a = s.getBandScalePadding) === null || _a === void 0 ? void 0 : _a.call(s); }).filter((p) => p != null);
            if (paddings.length > 0) {
                this.scale.paddingInner = Math.min(...paddings.map((p) => p.inner));
                this.scale.paddingOuter = Math.max(...paddings.map((p) => p.outer));
            }
        }
        return super.calculateDomain();
    }
}
CategoryAxis.className = 'CategoryAxis';
CategoryAxis.type = 'category';
__decorate([
    validation_1.Validate(validation_1.NUMBER(0, 1))
], CategoryAxis.prototype, "groupPaddingInner", void 0);
exports.CategoryAxis = CategoryAxis;
