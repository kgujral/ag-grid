"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeaderCtrl = void 0;
const keyCode_1 = require("../constants/keyCode");
const beanStub_1 = require("../context/beanStub");
const context_1 = require("../context/context");
const eventKeys_1 = require("../eventKeys");
const generic_1 = require("../utils/generic");
const managedFocusFeature_1 = require("../widgets/managedFocusFeature");
const headerNavigationService_1 = require("./common/headerNavigationService");
class GridHeaderCtrl extends beanStub_1.BeanStub {
    setComp(comp, eGui, eFocusableElement) {
        this.comp = comp;
        this.eGui = eGui;
        this.createManagedBean(new managedFocusFeature_1.ManagedFocusFeature(eFocusableElement, {
            onTabKeyDown: this.onTabKeyDown.bind(this),
            handleKeyDown: this.handleKeyDown.bind(this),
            onFocusOut: this.onFocusOut.bind(this)
        }));
        // for setting ag-pivot-on / ag-pivot-off CSS classes
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, this.onPivotModeChanged.bind(this));
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.onDisplayedColumnsChanged.bind(this));
        this.onPivotModeChanged();
        this.setupHeaderHeight();
        this.ctrlsService.registerGridHeaderCtrl(this);
    }
    setupHeaderHeight() {
        const listener = this.setHeaderHeight.bind(this);
        listener();
        this.addManagedPropertyListener('headerHeight', listener);
        this.addManagedPropertyListener('pivotHeaderHeight', listener);
        this.addManagedPropertyListener('groupHeaderHeight', listener);
        this.addManagedPropertyListener('pivotGroupHeaderHeight', listener);
        this.addManagedPropertyListener('floatingFiltersHeight', listener);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_DISPLAYED_COLUMNS_CHANGED, listener);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_COLUMN_HEADER_HEIGHT_CHANGED, listener);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_GRID_STYLES_CHANGED, listener);
        this.addManagedListener(this.eventService, eventKeys_1.Events.EVENT_ADVANCED_FILTER_ENABLED_CHANGED, listener);
    }
    getHeaderHeight() {
        return this.headerHeight;
    }
    setHeaderHeight() {
        const { columnModel } = this;
        let numberOfFloating = 0;
        let headerRowCount = columnModel.getHeaderRowCount();
        let totalHeaderHeight;
        const hasFloatingFilters = this.filterManager.hasFloatingFilters();
        if (hasFloatingFilters) {
            headerRowCount++;
            numberOfFloating = 1;
        }
        const groupHeight = this.columnModel.getColumnGroupHeaderRowHeight();
        const headerHeight = this.columnModel.getColumnHeaderRowHeight();
        const numberOfNonGroups = 1 + numberOfFloating;
        const numberOfGroups = headerRowCount - numberOfNonGroups;
        totalHeaderHeight = numberOfFloating * columnModel.getFloatingFiltersHeight();
        totalHeaderHeight += numberOfGroups * groupHeight;
        totalHeaderHeight += headerHeight;
        if (this.headerHeight === totalHeaderHeight) {
            return;
        }
        this.headerHeight = totalHeaderHeight;
        // one extra pixel is needed here to account for the
        // height of the border
        const px = `${totalHeaderHeight + 1}px`;
        this.comp.setHeightAndMinHeight(px);
        this.eventService.dispatchEvent({
            type: eventKeys_1.Events.EVENT_HEADER_HEIGHT_CHANGED
        });
    }
    onPivotModeChanged() {
        const pivotMode = this.columnModel.isPivotMode();
        this.comp.addOrRemoveCssClass('ag-pivot-on', pivotMode);
        this.comp.addOrRemoveCssClass('ag-pivot-off', !pivotMode);
    }
    onDisplayedColumnsChanged() {
        const columns = this.columnModel.getAllDisplayedColumns();
        const shouldAllowOverflow = columns.some(col => col.isSpanHeaderHeight());
        this.comp.addOrRemoveCssClass('ag-header-allow-overflow', shouldAllowOverflow);
    }
    onTabKeyDown(e) {
        const isRtl = this.gridOptionsService.is('enableRtl');
        const direction = e.shiftKey !== isRtl
            ? headerNavigationService_1.HeaderNavigationDirection.LEFT
            : headerNavigationService_1.HeaderNavigationDirection.RIGHT;
        if (this.headerNavigationService.navigateHorizontally(direction, true, e) ||
            this.focusService.focusNextGridCoreContainer(e.shiftKey)) {
            e.preventDefault();
        }
    }
    handleKeyDown(e) {
        let direction = null;
        switch (e.key) {
            case keyCode_1.KeyCode.LEFT:
                direction = headerNavigationService_1.HeaderNavigationDirection.LEFT;
            case keyCode_1.KeyCode.RIGHT:
                if (!generic_1.exists(direction)) {
                    direction = headerNavigationService_1.HeaderNavigationDirection.RIGHT;
                }
                this.headerNavigationService.navigateHorizontally(direction, false, e);
                break;
            case keyCode_1.KeyCode.UP:
                direction = headerNavigationService_1.HeaderNavigationDirection.UP;
            case keyCode_1.KeyCode.DOWN:
                if (!generic_1.exists(direction)) {
                    direction = headerNavigationService_1.HeaderNavigationDirection.DOWN;
                }
                if (this.headerNavigationService.navigateVertically(direction, null, e)) {
                    e.preventDefault();
                }
                break;
            default:
                return;
        }
    }
    onFocusOut(e) {
        const eDocument = this.gridOptionsService.getDocument();
        const { relatedTarget } = e;
        if (!relatedTarget && this.eGui.contains(eDocument.activeElement)) {
            return;
        }
        if (!this.eGui.contains(relatedTarget)) {
            this.focusService.clearFocusedHeader();
        }
    }
}
__decorate([
    context_1.Autowired('headerNavigationService')
], GridHeaderCtrl.prototype, "headerNavigationService", void 0);
__decorate([
    context_1.Autowired('focusService')
], GridHeaderCtrl.prototype, "focusService", void 0);
__decorate([
    context_1.Autowired('columnModel')
], GridHeaderCtrl.prototype, "columnModel", void 0);
__decorate([
    context_1.Autowired('ctrlsService')
], GridHeaderCtrl.prototype, "ctrlsService", void 0);
__decorate([
    context_1.Autowired('filterManager')
], GridHeaderCtrl.prototype, "filterManager", void 0);
exports.GridHeaderCtrl = GridHeaderCtrl;
