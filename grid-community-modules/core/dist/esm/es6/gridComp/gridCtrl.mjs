var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired } from "../context/context.mjs";
import { BeanStub } from "../context/beanStub.mjs";
import { ModuleRegistry } from "../modules/moduleRegistry.mjs";
import { ModuleNames } from "../modules/moduleNames.mjs";
import { LayoutFeature } from "../styling/layoutFeature.mjs";
import { Events } from "../eventKeys.mjs";
import { last } from "../utils/array.mjs";
import { DragAndDropService, DragSourceType } from "../dragAndDrop/dragAndDropService.mjs";
export class GridCtrl extends BeanStub {
    setComp(view, eGridDiv, eGui) {
        this.view = view;
        this.eGridHostDiv = eGridDiv;
        this.eGui = eGui;
        this.eGui.setAttribute('grid-id', this.context.getGridId());
        // this drop target is just used to see if the drop event is inside the grid
        this.dragAndDropService.addDropTarget({
            getContainer: () => this.eGui,
            isInterestedIn: (type) => type === DragSourceType.HeaderCell || type === DragSourceType.ToolPanel,
            getIconName: () => DragAndDropService.ICON_NOT_ALLOWED,
        });
        this.mouseEventService.stampTopLevelGridCompWithGridInstance(eGridDiv);
        this.createManagedBean(new LayoutFeature(this.view));
        this.addRtlSupport();
        this.addManagedListener(this, Events.EVENT_KEYBOARD_FOCUS, () => {
            this.view.addOrRemoveKeyboardFocusClass(true);
        });
        this.addManagedListener(this, Events.EVENT_MOUSE_FOCUS, () => {
            this.view.addOrRemoveKeyboardFocusClass(false);
        });
        const unsubscribeFromResize = this.resizeObserverService.observeResize(this.eGridHostDiv, this.onGridSizeChanged.bind(this));
        this.addDestroyFunc(() => unsubscribeFromResize());
        this.ctrlsService.registerGridCtrl(this);
    }
    isDetailGrid() {
        var _a;
        const el = this.focusService.findTabbableParent(this.getGui());
        return ((_a = el === null || el === void 0 ? void 0 : el.getAttribute('row-id')) === null || _a === void 0 ? void 0 : _a.startsWith('detail')) || false;
    }
    showDropZones() {
        return ModuleRegistry.__isRegistered(ModuleNames.RowGroupingModule, this.context.getGridId());
    }
    showSideBar() {
        return ModuleRegistry.__isRegistered(ModuleNames.SideBarModule, this.context.getGridId());
    }
    showStatusBar() {
        return ModuleRegistry.__isRegistered(ModuleNames.StatusBarModule, this.context.getGridId());
    }
    showWatermark() {
        return ModuleRegistry.__isRegistered(ModuleNames.EnterpriseCoreModule, this.context.getGridId());
    }
    onGridSizeChanged() {
        const event = {
            type: Events.EVENT_GRID_SIZE_CHANGED,
            clientWidth: this.eGridHostDiv.clientWidth,
            clientHeight: this.eGridHostDiv.clientHeight
        };
        this.eventService.dispatchEvent(event);
    }
    addRtlSupport() {
        const cssClass = this.gridOptionsService.is('enableRtl') ? 'ag-rtl' : 'ag-ltr';
        this.view.setRtlClass(cssClass);
    }
    destroyGridUi() {
        this.view.destroyGridUi();
    }
    getGui() {
        return this.eGui;
    }
    setResizeCursor(on) {
        this.view.setCursor(on ? 'ew-resize' : null);
    }
    disableUserSelect(on) {
        this.view.setUserSelect(on ? 'none' : null);
    }
    focusNextInnerContainer(backwards) {
        const eDocument = this.gridOptionsService.getDocument();
        const focusableContainers = this.view.getFocusableContainers();
        const idxWithFocus = focusableContainers.findIndex(container => container.contains(eDocument.activeElement));
        const nextIdx = idxWithFocus + (backwards ? -1 : 1);
        if (nextIdx <= 0 || nextIdx >= focusableContainers.length) {
            return false;
        }
        return this.focusService.focusInto(focusableContainers[nextIdx]);
    }
    focusInnerElement(fromBottom) {
        const focusableContainers = this.view.getFocusableContainers();
        const allColumns = this.columnModel.getAllDisplayedColumns();
        if (fromBottom) {
            if (focusableContainers.length > 1) {
                return this.focusService.focusInto(last(focusableContainers), true);
            }
            const lastColumn = last(allColumns);
            if (this.focusService.focusGridView(lastColumn, true)) {
                return true;
            }
        }
        if (this.gridOptionsService.getNum('headerHeight') === 0) {
            return this.focusService.focusGridView(allColumns[0]);
        }
        return this.focusService.focusFirstHeader();
    }
    forceFocusOutOfContainer(up = false) {
        this.view.forceFocusOutOfContainer(up);
    }
}
__decorate([
    Autowired('focusService')
], GridCtrl.prototype, "focusService", void 0);
__decorate([
    Autowired('resizeObserverService')
], GridCtrl.prototype, "resizeObserverService", void 0);
__decorate([
    Autowired('columnModel')
], GridCtrl.prototype, "columnModel", void 0);
__decorate([
    Autowired('ctrlsService')
], GridCtrl.prototype, "ctrlsService", void 0);
__decorate([
    Autowired('mouseEventService')
], GridCtrl.prototype, "mouseEventService", void 0);
__decorate([
    Autowired('dragAndDropService')
], GridCtrl.prototype, "dragAndDropService", void 0);
