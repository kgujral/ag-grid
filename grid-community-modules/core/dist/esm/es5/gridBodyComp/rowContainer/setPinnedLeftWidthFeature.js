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
import { BeanStub } from "../../context/beanStub";
import { Autowired, PostConstruct } from "../../context/context";
import { Events } from "../../eventKeys";
import { setDisplayed, setFixedWidth } from "../../utils/dom";
var SetPinnedLeftWidthFeature = /** @class */ (function (_super) {
    __extends(SetPinnedLeftWidthFeature, _super);
    function SetPinnedLeftWidthFeature(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        return _this;
    }
    SetPinnedLeftWidthFeature.prototype.postConstruct = function () {
        this.addManagedListener(this.eventService, Events.EVENT_LEFT_PINNED_WIDTH_CHANGED, this.onPinnedLeftWidthChanged.bind(this));
    };
    SetPinnedLeftWidthFeature.prototype.onPinnedLeftWidthChanged = function () {
        var leftWidth = this.pinnedWidthService.getPinnedLeftWidth();
        var displayed = leftWidth > 0;
        setDisplayed(this.element, displayed);
        setFixedWidth(this.element, leftWidth);
    };
    SetPinnedLeftWidthFeature.prototype.getWidth = function () {
        return this.pinnedWidthService.getPinnedLeftWidth();
    };
    __decorate([
        Autowired('pinnedWidthService')
    ], SetPinnedLeftWidthFeature.prototype, "pinnedWidthService", void 0);
    __decorate([
        PostConstruct
    ], SetPinnedLeftWidthFeature.prototype, "postConstruct", null);
    return SetPinnedLeftWidthFeature;
}(BeanStub));
export { SetPinnedLeftWidthFeature };
