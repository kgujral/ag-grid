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
import { Bean, PostConstruct } from "../context/context";
import { BeanStub } from "../context/beanStub";
import { exists } from "../utils/generic";
var SelectableService = /** @class */ (function (_super) {
    __extends(SelectableService, _super);
    function SelectableService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectableService.prototype.init = function () {
        this.groupSelectsChildren = this.gridOptionsService.is('groupSelectsChildren');
        this.isRowSelectableFunc = this.gridOptionsService.get('isRowSelectable');
    };
    SelectableService.prototype.updateSelectableAfterGrouping = function (rowNode) {
        if (this.isRowSelectableFunc) {
            var nextChildrenFunc = function (node) { return node.childrenAfterGroup; };
            this.recurseDown(rowNode.childrenAfterGroup, nextChildrenFunc);
        }
    };
    SelectableService.prototype.recurseDown = function (children, nextChildrenFunc) {
        var _this = this;
        if (!children) {
            return;
        }
        children.forEach(function (child) {
            if (!child.group) {
                return;
            } // only interested in groups
            if (child.hasChildren()) {
                _this.recurseDown(nextChildrenFunc(child), nextChildrenFunc);
            }
            var rowSelectable;
            if (_this.groupSelectsChildren) {
                // have this group selectable if at least one direct child is selectable
                var firstSelectable = (nextChildrenFunc(child) || []).find(function (rowNode) { return rowNode.selectable === true; });
                rowSelectable = exists(firstSelectable);
            }
            else {
                // directly retrieve selectable value from user callback
                rowSelectable = _this.isRowSelectableFunc ? _this.isRowSelectableFunc(child) : false;
            }
            child.setRowSelectable(rowSelectable);
        });
    };
    __decorate([
        PostConstruct
    ], SelectableService.prototype, "init", null);
    SelectableService = __decorate([
        Bean('selectableService')
    ], SelectableService);
    return SelectableService;
}(BeanStub));
export { SelectableService };
