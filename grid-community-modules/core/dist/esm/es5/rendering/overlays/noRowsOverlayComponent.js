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
import { Component } from "../../widgets/component";
var NoRowsOverlayComponent = /** @class */ (function (_super) {
    __extends(NoRowsOverlayComponent, _super);
    function NoRowsOverlayComponent() {
        return _super.call(this) || this;
    }
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    NoRowsOverlayComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    NoRowsOverlayComponent.prototype.init = function (params) {
        var _a;
        var template = (_a = this.gridOptionsService.get('overlayNoRowsTemplate')) !== null && _a !== void 0 ? _a : NoRowsOverlayComponent.DEFAULT_NO_ROWS_TEMPLATE;
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var localisedTemplate = template.replace('[NO_ROWS_TO_SHOW]', localeTextFunc('noRowsToShow', 'No Rows To Show'));
        this.setTemplate(localisedTemplate);
    };
    NoRowsOverlayComponent.DEFAULT_NO_ROWS_TEMPLATE = '<span class="ag-overlay-no-rows-center">[NO_ROWS_TO_SHOW]</span>';
    return NoRowsOverlayComponent;
}(Component));
export { NoRowsOverlayComponent };
