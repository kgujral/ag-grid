var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { AgAbstractInputField } from "./agAbstractInputField";
var AgInputRange = /** @class */ (function (_super) {
    __extends(AgInputRange, _super);
    function AgInputRange(config) {
        return _super.call(this, config, 'ag-range-field', 'range') || this;
    }
    AgInputRange.prototype.postConstruct = function () {
        _super.prototype.postConstruct.call(this);
        var _a = this.config, min = _a.min, max = _a.max, step = _a.step;
        if (min != null) {
            this.setMinValue(min);
        }
        if (max != null) {
            this.setMaxValue(max);
        }
        this.setStep(step || 1);
    };
    AgInputRange.prototype.addInputListeners = function () {
        var _this = this;
        this.addManagedListener(this.eInput, 'input', function (e) {
            var value = e.target.value;
            _this.setValue(value);
        });
    };
    AgInputRange.prototype.setMinValue = function (value) {
        this.min = value;
        this.eInput.setAttribute('min', value.toString());
        return this;
    };
    AgInputRange.prototype.setMaxValue = function (value) {
        this.max = value;
        this.eInput.setAttribute('max', value.toString());
        return this;
    };
    AgInputRange.prototype.setStep = function (value) {
        this.eInput.setAttribute('step', value.toString());
        return this;
    };
    AgInputRange.prototype.setValue = function (value, silent) {
        if (this.min != null) {
            value = Math.max(parseFloat(value), this.min).toString();
        }
        if (this.max != null) {
            value = Math.min(parseFloat(value), this.max).toString();
        }
        var ret = _super.prototype.setValue.call(this, value, silent);
        this.eInput.value = value;
        return ret;
    };
    return AgInputRange;
}(AgAbstractInputField));
export { AgInputRange };
