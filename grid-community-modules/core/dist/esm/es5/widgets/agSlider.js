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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RefSelector } from "./componentAnnotations";
import { AgAbstractLabel } from "./agAbstractLabel";
import { PostConstruct } from "../context/context";
import { Events } from "../eventKeys";
var AgSlider = /** @class */ (function (_super) {
    __extends(AgSlider, _super);
    function AgSlider(config) {
        var _this = _super.call(this, config, AgSlider.TEMPLATE) || this;
        _this.labelAlignment = 'top';
        return _this;
    }
    AgSlider.prototype.init = function () {
        this.eSlider.addCssClass('ag-slider-field');
    };
    AgSlider.prototype.onValueChange = function (callbackFn) {
        var _this = this;
        var eventChanged = Events.EVENT_FIELD_VALUE_CHANGED;
        this.addManagedListener(this.eText, eventChanged, function () {
            var textValue = parseFloat(_this.eText.getValue());
            _this.eSlider.setValue(textValue.toString(), true);
            callbackFn(textValue || 0);
        });
        this.addManagedListener(this.eSlider, eventChanged, function () {
            var sliderValue = _this.eSlider.getValue();
            _this.eText.setValue(sliderValue, true);
            callbackFn(parseFloat(sliderValue));
        });
        return this;
    };
    AgSlider.prototype.setSliderWidth = function (width) {
        this.eSlider.setWidth(width);
        return this;
    };
    AgSlider.prototype.setTextFieldWidth = function (width) {
        this.eText.setWidth(width);
        return this;
    };
    AgSlider.prototype.setMinValue = function (minValue) {
        this.eSlider.setMinValue(minValue);
        this.eText.setMin(minValue);
        return this;
    };
    AgSlider.prototype.setMaxValue = function (maxValue) {
        this.eSlider.setMaxValue(maxValue);
        this.eText.setMax(maxValue);
        return this;
    };
    AgSlider.prototype.getValue = function () {
        return this.eText.getValue();
    };
    AgSlider.prototype.setValue = function (value) {
        if (this.getValue() === value) {
            return this;
        }
        this.eText.setValue(value, true);
        this.eSlider.setValue(value, true);
        this.dispatchEvent({ type: Events.EVENT_FIELD_VALUE_CHANGED });
        return this;
    };
    AgSlider.prototype.setStep = function (step) {
        this.eSlider.setStep(step);
        this.eText.setStep(step);
        return this;
    };
    AgSlider.TEMPLATE = "<div class=\"ag-slider\">\n            <label ref=\"eLabel\"></label>\n            <div class=\"ag-wrapper ag-slider-wrapper\">\n                <ag-input-range ref=\"eSlider\"></ag-input-range>\n                <ag-input-number-field ref=\"eText\"></ag-input-number-field>\n            </div>\n        </div>";
    __decorate([
        RefSelector('eLabel')
    ], AgSlider.prototype, "eLabel", void 0);
    __decorate([
        RefSelector('eSlider')
    ], AgSlider.prototype, "eSlider", void 0);
    __decorate([
        RefSelector('eText')
    ], AgSlider.prototype, "eText", void 0);
    __decorate([
        PostConstruct
    ], AgSlider.prototype, "init", null);
    return AgSlider;
}(AgAbstractLabel));
export { AgSlider };
