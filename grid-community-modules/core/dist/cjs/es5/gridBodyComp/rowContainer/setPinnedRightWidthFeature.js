"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPinnedRightWidthFeature = void 0;
var context_1 = require("../../context/context");
var eventKeys_1 = require("../../eventKeys");
var dom_1 = require("../../utils/dom");
var beanStub_1 = require("../../context/beanStub");
var SetPinnedRightWidthFeature = /** @class */ (function (_super) {
    __extends(SetPinnedRightWidthFeature, _super);
    function SetPinnedRightWidthFeature(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        return _this;
    }
    SetPinnedRightWidthFeature.prototype.postConstruct = function () {
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_RIGHT_PINNED_WIDTH_CHANGED, this.onPinnedRightWidthChanged.bind(this));
    };
    SetPinnedRightWidthFeature.prototype.onPinnedRightWidthChanged = function () {
        var rightWidth = this.pinnedWidthService.getPinnedRightWidth();
        var displayed = rightWidth > 0;
        dom_1.setDisplayed(this.element, displayed);
        dom_1.setFixedWidth(this.element, rightWidth);
    };
    SetPinnedRightWidthFeature.prototype.getWidth = function () {
        return this.pinnedWidthService.getPinnedRightWidth();
    };
    __decorate([
        context_1.Autowired('pinnedWidthService')
    ], SetPinnedRightWidthFeature.prototype, "pinnedWidthService", void 0);
    __decorate([
        context_1.PostConstruct
    ], SetPinnedRightWidthFeature.prototype, "postConstruct", null);
    return SetPinnedRightWidthFeature;
}(beanStub_1.BeanStub));
exports.SetPinnedRightWidthFeature = SetPinnedRightWidthFeature;
