var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired, Bean, Optional, PostConstruct } from "../context/context";
/** Using the IoC has a slight performance consideration, which is no problem most of the
 * time, unless we are trashing objects - which is the case when scrolling and rowComp
 * and cellComp. So for performance reasons, RowComp and CellComp do not get autowired
 * with the IoC. Instead they get passed this object which is all the beans the RowComp
 * and CellComp need. Not autowiring all the cells gives performance improvement. */
var Beans = /** @class */ (function () {
    function Beans() {
    }
    Beans.prototype.postConstruct = function () {
        this.doingMasterDetail = this.gridOptionsService.isMasterDetail();
        if (this.gridOptionsService.isRowModelType('clientSide')) {
            this.clientSideRowModel = this.rowModel;
        }
        if (this.gridOptionsService.isRowModelType('serverSide')) {
            this.serverSideRowModel = this.rowModel;
        }
    };
    __decorate([
        Autowired('resizeObserverService')
    ], Beans.prototype, "resizeObserverService", void 0);
    __decorate([
        Autowired('paginationProxy')
    ], Beans.prototype, "paginationProxy", void 0);
    __decorate([
        Autowired('context')
    ], Beans.prototype, "context", void 0);
    __decorate([
        Autowired('columnApi')
    ], Beans.prototype, "columnApi", void 0);
    __decorate([
        Autowired('gridApi')
    ], Beans.prototype, "gridApi", void 0);
    __decorate([
        Autowired('gridOptionsService')
    ], Beans.prototype, "gridOptionsService", void 0);
    __decorate([
        Autowired('expressionService')
    ], Beans.prototype, "expressionService", void 0);
    __decorate([
        Autowired('environment')
    ], Beans.prototype, "environment", void 0);
    __decorate([
        Autowired('rowRenderer')
    ], Beans.prototype, "rowRenderer", void 0);
    __decorate([
        Autowired('templateService')
    ], Beans.prototype, "templateService", void 0);
    __decorate([
        Autowired('valueService')
    ], Beans.prototype, "valueService", void 0);
    __decorate([
        Autowired('eventService')
    ], Beans.prototype, "eventService", void 0);
    __decorate([
        Autowired('columnModel')
    ], Beans.prototype, "columnModel", void 0);
    __decorate([
        Autowired('headerNavigationService')
    ], Beans.prototype, "headerNavigationService", void 0);
    __decorate([
        Autowired('navigationService')
    ], Beans.prototype, "navigationService", void 0);
    __decorate([
        Autowired('columnAnimationService')
    ], Beans.prototype, "columnAnimationService", void 0);
    __decorate([
        Optional('rangeService')
    ], Beans.prototype, "rangeService", void 0);
    __decorate([
        Autowired('focusService')
    ], Beans.prototype, "focusService", void 0);
    __decorate([
        Optional('contextMenuFactory')
    ], Beans.prototype, "contextMenuFactory", void 0);
    __decorate([
        Autowired('popupService')
    ], Beans.prototype, "popupService", void 0);
    __decorate([
        Autowired('valueFormatterService')
    ], Beans.prototype, "valueFormatterService", void 0);
    __decorate([
        Autowired('stylingService')
    ], Beans.prototype, "stylingService", void 0);
    __decorate([
        Autowired('columnHoverService')
    ], Beans.prototype, "columnHoverService", void 0);
    __decorate([
        Autowired('userComponentFactory')
    ], Beans.prototype, "userComponentFactory", void 0);
    __decorate([
        Autowired('userComponentRegistry')
    ], Beans.prototype, "userComponentRegistry", void 0);
    __decorate([
        Autowired('animationFrameService')
    ], Beans.prototype, "animationFrameService", void 0);
    __decorate([
        Autowired('dragService')
    ], Beans.prototype, "dragService", void 0);
    __decorate([
        Autowired('dragAndDropService')
    ], Beans.prototype, "dragAndDropService", void 0);
    __decorate([
        Autowired('sortController')
    ], Beans.prototype, "sortController", void 0);
    __decorate([
        Autowired('filterManager')
    ], Beans.prototype, "filterManager", void 0);
    __decorate([
        Autowired('rowContainerHeightService')
    ], Beans.prototype, "rowContainerHeightService", void 0);
    __decorate([
        Autowired('frameworkOverrides')
    ], Beans.prototype, "frameworkOverrides", void 0);
    __decorate([
        Autowired('cellPositionUtils')
    ], Beans.prototype, "cellPositionUtils", void 0);
    __decorate([
        Autowired('rowPositionUtils')
    ], Beans.prototype, "rowPositionUtils", void 0);
    __decorate([
        Autowired('selectionService')
    ], Beans.prototype, "selectionService", void 0);
    __decorate([
        Optional('selectionHandleFactory')
    ], Beans.prototype, "selectionHandleFactory", void 0);
    __decorate([
        Autowired('rowCssClassCalculator')
    ], Beans.prototype, "rowCssClassCalculator", void 0);
    __decorate([
        Autowired('rowModel')
    ], Beans.prototype, "rowModel", void 0);
    __decorate([
        Autowired('ctrlsService')
    ], Beans.prototype, "ctrlsService", void 0);
    __decorate([
        Autowired('ctrlsFactory')
    ], Beans.prototype, "ctrlsFactory", void 0);
    __decorate([
        Autowired('agStackComponentsRegistry')
    ], Beans.prototype, "agStackComponentsRegistry", void 0);
    __decorate([
        Autowired('valueCache')
    ], Beans.prototype, "valueCache", void 0);
    __decorate([
        Autowired('rowNodeEventThrottle')
    ], Beans.prototype, "rowNodeEventThrottle", void 0);
    __decorate([
        Autowired('localeService')
    ], Beans.prototype, "localeService", void 0);
    __decorate([
        Autowired('valueParserService')
    ], Beans.prototype, "valueParserService", void 0);
    __decorate([
        PostConstruct
    ], Beans.prototype, "postConstruct", null);
    Beans = __decorate([
        Bean('beans')
    ], Beans);
    return Beans;
}());
export { Beans };
