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
exports.LoadingCellRenderer = void 0;
var component_1 = require("../../widgets/component");
var componentAnnotations_1 = require("../../widgets/componentAnnotations");
var icon_1 = require("../../utils/icon");
var LoadingCellRenderer = /** @class */ (function (_super) {
    __extends(LoadingCellRenderer, _super);
    function LoadingCellRenderer() {
        return _super.call(this, LoadingCellRenderer.TEMPLATE) || this;
    }
    LoadingCellRenderer.prototype.init = function (params) {
        params.node.failedLoad ? this.setupFailed() : this.setupLoading();
    };
    LoadingCellRenderer.prototype.setupFailed = function () {
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        this.eLoadingText.innerText = localeTextFunc('loadingError', 'ERR');
    };
    LoadingCellRenderer.prototype.setupLoading = function () {
        var eLoadingIcon = icon_1.createIconNoSpan('groupLoading', this.gridOptionsService, null);
        if (eLoadingIcon) {
            this.eLoadingIcon.appendChild(eLoadingIcon);
        }
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        this.eLoadingText.innerText = localeTextFunc('loadingOoo', 'Loading');
    };
    LoadingCellRenderer.prototype.refresh = function (params) {
        return false;
    };
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    LoadingCellRenderer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    LoadingCellRenderer.TEMPLATE = "<div class=\"ag-loading\">\n            <span class=\"ag-loading-icon\" ref=\"eLoadingIcon\"></span>\n            <span class=\"ag-loading-text\" ref=\"eLoadingText\"></span>\n        </div>";
    __decorate([
        componentAnnotations_1.RefSelector('eLoadingIcon')
    ], LoadingCellRenderer.prototype, "eLoadingIcon", void 0);
    __decorate([
        componentAnnotations_1.RefSelector('eLoadingText')
    ], LoadingCellRenderer.prototype, "eLoadingText", void 0);
    return LoadingCellRenderer;
}(component_1.Component));
exports.LoadingCellRenderer = LoadingCellRenderer;
