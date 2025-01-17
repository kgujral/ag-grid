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
exports.FakeVScrollComp = void 0;
var context_1 = require("../context/context");
var abstractFakeScrollComp_1 = require("./abstractFakeScrollComp");
var dom_1 = require("../utils/dom");
var setHeightFeature_1 = require("./rowContainer/setHeightFeature");
var eventKeys_1 = require("../eventKeys");
var FakeVScrollComp = /** @class */ (function (_super) {
    __extends(FakeVScrollComp, _super);
    function FakeVScrollComp() {
        return _super.call(this, FakeVScrollComp.TEMPLATE, 'vertical') || this;
    }
    FakeVScrollComp.prototype.postConstruct = function () {
        _super.prototype.postConstruct.call(this);
        this.createManagedBean(new setHeightFeature_1.SetHeightFeature(this.eContainer));
        this.ctrlsService.registerFakeVScrollComp(this);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_ROW_CONTAINER_HEIGHT_CHANGED, this.onRowContainerHeightChanged.bind(this));
    };
    FakeVScrollComp.prototype.setScrollVisible = function () {
        var vScrollShowing = this.scrollVisibleService.isVerticalScrollShowing();
        var invisibleScrollbar = this.invisibleScrollbar;
        var scrollbarWidth = vScrollShowing ? (this.gridOptionsService.getScrollbarWidth() || 0) : 0;
        var adjustedScrollbarWidth = (scrollbarWidth === 0 && invisibleScrollbar) ? 16 : scrollbarWidth;
        this.addOrRemoveCssClass('ag-scrollbar-invisible', invisibleScrollbar);
        dom_1.setFixedWidth(this.getGui(), adjustedScrollbarWidth);
        dom_1.setFixedWidth(this.eViewport, adjustedScrollbarWidth);
        dom_1.setFixedWidth(this.eContainer, adjustedScrollbarWidth);
        this.setDisplayed(vScrollShowing, { skipAriaHidden: true });
    };
    FakeVScrollComp.prototype.onRowContainerHeightChanged = function () {
        var gridBodyCtrl = this.ctrlsService.getGridBodyCtrl();
        var gridBodyViewportEl = gridBodyCtrl.getBodyViewportElement();
        if (this.eViewport.scrollTop != gridBodyViewportEl.scrollTop) {
            this.eViewport.scrollTop = gridBodyViewportEl.scrollTop;
        }
    };
    FakeVScrollComp.prototype.getScrollPosition = function () {
        return this.getViewport().scrollTop;
    };
    FakeVScrollComp.prototype.setScrollPosition = function (value) {
        if (!dom_1.isVisible(this.getViewport())) {
            this.attemptSettingScrollPosition(value);
        }
        this.getViewport().scrollTop = value;
    };
    FakeVScrollComp.TEMPLATE = "<div class=\"ag-body-vertical-scroll\" aria-hidden=\"true\">\n            <div class=\"ag-body-vertical-scroll-viewport\" ref=\"eViewport\">\n                <div class=\"ag-body-vertical-scroll-container\" ref=\"eContainer\"></div>\n            </div>\n        </div>";
    __decorate([
        context_1.PostConstruct
    ], FakeVScrollComp.prototype, "postConstruct", null);
    return FakeVScrollComp;
}(abstractFakeScrollComp_1.AbstractFakeScrollComp));
exports.FakeVScrollComp = FakeVScrollComp;
