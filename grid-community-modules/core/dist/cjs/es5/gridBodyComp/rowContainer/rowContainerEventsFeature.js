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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowContainerEventsFeature = void 0;
var beanStub_1 = require("../../context/beanStub");
var event_1 = require("../../utils/event");
var context_1 = require("../../context/context");
var rowCtrl_1 = require("../../rendering/row/rowCtrl");
var browser_1 = require("../../utils/browser");
var touchListener_1 = require("../../widgets/touchListener");
var keyboard_1 = require("../../utils/keyboard");
var events_1 = require("../../events");
var keyCode_1 = require("../../constants/keyCode");
var generic_1 = require("../../utils/generic");
var array_1 = require("../../utils/array");
var keyboard_2 = require("../../utils/keyboard");
var cellCtrl_1 = require("../../rendering/cell/cellCtrl");
var RowContainerEventsFeature = /** @class */ (function (_super) {
    __extends(RowContainerEventsFeature, _super);
    function RowContainerEventsFeature(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        return _this;
    }
    RowContainerEventsFeature.prototype.postConstruct = function () {
        this.addKeyboardListeners();
        this.addMouseListeners();
        this.mockContextMenuForIPad();
    };
    RowContainerEventsFeature.prototype.addKeyboardListeners = function () {
        var eventName = 'keydown';
        var listener = this.processKeyboardEvent.bind(this, eventName);
        this.addManagedListener(this.element, eventName, listener);
    };
    RowContainerEventsFeature.prototype.addMouseListeners = function () {
        var _this = this;
        var mouseDownEvent = event_1.isEventSupported('touchstart') ? 'touchstart' : 'mousedown';
        var eventNames = ['dblclick', 'contextmenu', 'mouseover', 'mouseout', 'click', mouseDownEvent];
        eventNames.forEach(function (eventName) {
            var listener = _this.processMouseEvent.bind(_this, eventName);
            _this.addManagedListener(_this.element, eventName, listener);
        });
    };
    RowContainerEventsFeature.prototype.processMouseEvent = function (eventName, mouseEvent) {
        if (!this.mouseEventService.isEventFromThisGrid(mouseEvent) ||
            event_1.isStopPropagationForAgGrid(mouseEvent)) {
            return;
        }
        var rowComp = this.getRowForEvent(mouseEvent);
        var cellCtrl = this.mouseEventService.getRenderedCellForEvent(mouseEvent);
        if (eventName === "contextmenu") {
            this.handleContextMenuMouseEvent(mouseEvent, null, rowComp, cellCtrl);
        }
        else {
            if (cellCtrl) {
                cellCtrl.onMouseEvent(eventName, mouseEvent);
            }
            if (rowComp) {
                rowComp.onMouseEvent(eventName, mouseEvent);
            }
        }
    };
    RowContainerEventsFeature.prototype.mockContextMenuForIPad = function () {
        var _this = this;
        // we do NOT want this when not in iPad, otherwise we will be doing
        if (!browser_1.isIOSUserAgent()) {
            return;
        }
        var touchListener = new touchListener_1.TouchListener(this.element);
        var longTapListener = function (event) {
            var rowComp = _this.getRowForEvent(event.touchEvent);
            var cellComp = _this.mouseEventService.getRenderedCellForEvent(event.touchEvent);
            _this.handleContextMenuMouseEvent(null, event.touchEvent, rowComp, cellComp);
        };
        this.addManagedListener(touchListener, touchListener_1.TouchListener.EVENT_LONG_TAP, longTapListener);
        this.addDestroyFunc(function () { return touchListener.destroy(); });
    };
    RowContainerEventsFeature.prototype.getRowForEvent = function (event) {
        var sourceElement = event.target;
        while (sourceElement) {
            var rowCon = this.gridOptionsService.getDomData(sourceElement, rowCtrl_1.RowCtrl.DOM_DATA_KEY_ROW_CTRL);
            if (rowCon) {
                return rowCon;
            }
            sourceElement = sourceElement.parentElement;
        }
        return null;
    };
    RowContainerEventsFeature.prototype.handleContextMenuMouseEvent = function (mouseEvent, touchEvent, rowComp, cellCtrl) {
        var rowNode = rowComp ? rowComp.getRowNode() : null;
        var column = cellCtrl ? cellCtrl.getColumn() : null;
        var value = null;
        if (column) {
            var event_2 = mouseEvent ? mouseEvent : touchEvent;
            cellCtrl.dispatchCellContextMenuEvent(event_2);
            value = this.valueService.getValue(column, rowNode);
        }
        // if user clicked on a cell, anchor to that cell, otherwise anchor to the grid panel
        var gridBodyCon = this.ctrlsService.getGridBodyCtrl();
        var anchorToElement = cellCtrl ? cellCtrl.getGui() : gridBodyCon.getGridBodyElement();
        if (this.contextMenuFactory) {
            this.contextMenuFactory.onContextMenu(mouseEvent, touchEvent, rowNode, column, value, anchorToElement);
        }
    };
    RowContainerEventsFeature.prototype.getControlsForEventTarget = function (target) {
        return {
            cellCtrl: event_1.getCtrlForEventTarget(this.gridOptionsService, target, cellCtrl_1.CellCtrl.DOM_DATA_KEY_CELL_CTRL),
            rowCtrl: event_1.getCtrlForEventTarget(this.gridOptionsService, target, rowCtrl_1.RowCtrl.DOM_DATA_KEY_ROW_CTRL)
        };
    };
    RowContainerEventsFeature.prototype.processKeyboardEvent = function (eventName, keyboardEvent) {
        var _a = this.getControlsForEventTarget(keyboardEvent.target), cellCtrl = _a.cellCtrl, rowCtrl = _a.rowCtrl;
        if (keyboardEvent.defaultPrevented) {
            return;
        }
        if (cellCtrl) {
            this.processCellKeyboardEvent(cellCtrl, eventName, keyboardEvent);
        }
        else if (rowCtrl && rowCtrl.isFullWidth()) {
            this.processFullWidthRowKeyboardEvent(rowCtrl, eventName, keyboardEvent);
        }
    };
    RowContainerEventsFeature.prototype.processCellKeyboardEvent = function (cellCtrl, eventName, keyboardEvent) {
        var rowNode = cellCtrl.getRowNode();
        var column = cellCtrl.getColumn();
        var editing = cellCtrl.isEditing();
        var gridProcessingAllowed = !keyboard_1.isUserSuppressingKeyboardEvent(this.gridOptionsService, keyboardEvent, rowNode, column, editing);
        if (gridProcessingAllowed) {
            if (eventName === 'keydown') {
                // first see if it's a scroll key, page up / down, home / end etc
                var wasScrollKey = !editing && this.navigationService.handlePageScrollingKey(keyboardEvent);
                // if not a scroll key, then we pass onto cell
                if (!wasScrollKey) {
                    cellCtrl.onKeyDown(keyboardEvent);
                }
                // perform clipboard and undo / redo operations
                this.doGridOperations(keyboardEvent, cellCtrl.isEditing());
                if (keyboard_1.isEventFromPrintableCharacter(keyboardEvent)) {
                    cellCtrl.processCharacter(keyboardEvent);
                }
            }
        }
        if (eventName === 'keydown') {
            var cellKeyDownEvent = cellCtrl.createEvent(keyboardEvent, events_1.Events.EVENT_CELL_KEY_DOWN);
            this.eventService.dispatchEvent(cellKeyDownEvent);
        }
    };
    RowContainerEventsFeature.prototype.processFullWidthRowKeyboardEvent = function (rowComp, eventName, keyboardEvent) {
        var rowNode = rowComp.getRowNode();
        var focusedCell = this.focusService.getFocusedCell();
        var column = (focusedCell && focusedCell.column);
        var gridProcessingAllowed = !keyboard_1.isUserSuppressingKeyboardEvent(this.gridOptionsService, keyboardEvent, rowNode, column, false);
        if (gridProcessingAllowed) {
            var key = keyboardEvent.key;
            if (eventName === 'keydown') {
                switch (key) {
                    case keyCode_1.KeyCode.PAGE_HOME:
                    case keyCode_1.KeyCode.PAGE_END:
                    case keyCode_1.KeyCode.PAGE_UP:
                    case keyCode_1.KeyCode.PAGE_DOWN:
                        this.navigationService.handlePageScrollingKey(keyboardEvent, true);
                        break;
                    case keyCode_1.KeyCode.UP:
                    case keyCode_1.KeyCode.DOWN:
                        rowComp.onKeyboardNavigate(keyboardEvent);
                        break;
                    case keyCode_1.KeyCode.TAB:
                        rowComp.onTabKeyDown(keyboardEvent);
                        break;
                    default:
                }
            }
        }
        if (eventName === 'keydown') {
            var cellKeyDownEvent = rowComp.createRowEvent(events_1.Events.EVENT_CELL_KEY_DOWN, keyboardEvent);
            this.eventService.dispatchEvent(cellKeyDownEvent);
        }
    };
    RowContainerEventsFeature.prototype.doGridOperations = function (keyboardEvent, editing) {
        // check if ctrl or meta key pressed
        if (!keyboardEvent.ctrlKey && !keyboardEvent.metaKey) {
            return;
        }
        // if the cell the event came from is editing, then we do not
        // want to do the default shortcut keys, otherwise the editor
        // (eg a text field) would not be able to do the normal cut/copy/paste
        if (editing) {
            return;
        }
        // for copy / paste, we don't want to execute when the event
        // was from a child grid (happens in master detail)
        if (!this.mouseEventService.isEventFromThisGrid(keyboardEvent)) {
            return;
        }
        var keyCode = keyboard_2.normaliseQwertyAzerty(keyboardEvent);
        if (keyCode === keyCode_1.KeyCode.A) {
            return this.onCtrlAndA(keyboardEvent);
        }
        if (keyCode === keyCode_1.KeyCode.C) {
            return this.onCtrlAndC(keyboardEvent);
        }
        if (keyCode === keyCode_1.KeyCode.D) {
            return this.onCtrlAndD(keyboardEvent);
        }
        if (keyCode === keyCode_1.KeyCode.V) {
            return this.onCtrlAndV(keyboardEvent);
        }
        if (keyCode === keyCode_1.KeyCode.X) {
            return this.onCtrlAndX(keyboardEvent);
        }
        if (keyCode === keyCode_1.KeyCode.Y) {
            return this.onCtrlAndY();
        }
        if (keyCode === keyCode_1.KeyCode.Z) {
            return this.onCtrlAndZ(keyboardEvent);
        }
    };
    RowContainerEventsFeature.prototype.onCtrlAndA = function (event) {
        var _a = this, pinnedRowModel = _a.pinnedRowModel, paginationProxy = _a.paginationProxy, rangeService = _a.rangeService;
        if (rangeService && paginationProxy.isRowsToRender()) {
            var _b = __read([
                pinnedRowModel.isEmpty('top'),
                pinnedRowModel.isEmpty('bottom')
            ], 2), isEmptyPinnedTop = _b[0], isEmptyPinnedBottom = _b[1];
            var floatingStart = isEmptyPinnedTop ? null : 'top';
            var floatingEnd = void 0;
            var rowEnd = void 0;
            if (isEmptyPinnedBottom) {
                floatingEnd = null;
                rowEnd = this.paginationProxy.getRowCount() - 1;
            }
            else {
                floatingEnd = 'bottom';
                rowEnd = pinnedRowModel.getPinnedBottomRowData().length - 1;
            }
            var allDisplayedColumns = this.columnModel.getAllDisplayedColumns();
            if (generic_1.missingOrEmpty(allDisplayedColumns)) {
                return;
            }
            rangeService.setCellRange({
                rowStartIndex: 0,
                rowStartPinned: floatingStart,
                rowEndIndex: rowEnd,
                rowEndPinned: floatingEnd,
                columnStart: allDisplayedColumns[0],
                columnEnd: array_1.last(allDisplayedColumns)
            });
        }
        event.preventDefault();
    };
    RowContainerEventsFeature.prototype.onCtrlAndC = function (event) {
        if (!this.clipboardService || this.gridOptionsService.is('enableCellTextSelection')) {
            return;
        }
        var _a = this.getControlsForEventTarget(event.target), cellCtrl = _a.cellCtrl, rowCtrl = _a.rowCtrl;
        if ((cellCtrl === null || cellCtrl === void 0 ? void 0 : cellCtrl.isEditing()) || (rowCtrl === null || rowCtrl === void 0 ? void 0 : rowCtrl.isEditing())) {
            return;
        }
        event.preventDefault();
        this.clipboardService.copyToClipboard();
    };
    RowContainerEventsFeature.prototype.onCtrlAndX = function (event) {
        if (!this.clipboardService ||
            this.gridOptionsService.is('enableCellTextSelection') ||
            this.gridOptionsService.is('suppressCutToClipboard')) {
            return;
        }
        var _a = this.getControlsForEventTarget(event.target), cellCtrl = _a.cellCtrl, rowCtrl = _a.rowCtrl;
        if ((cellCtrl === null || cellCtrl === void 0 ? void 0 : cellCtrl.isEditing()) || (rowCtrl === null || rowCtrl === void 0 ? void 0 : rowCtrl.isEditing())) {
            return;
        }
        event.preventDefault();
        this.clipboardService.cutToClipboard(undefined, 'ui');
    };
    RowContainerEventsFeature.prototype.onCtrlAndV = function (event) {
        var _a = this.getControlsForEventTarget(event.target), cellCtrl = _a.cellCtrl, rowCtrl = _a.rowCtrl;
        if ((cellCtrl === null || cellCtrl === void 0 ? void 0 : cellCtrl.isEditing()) || (rowCtrl === null || rowCtrl === void 0 ? void 0 : rowCtrl.isEditing())) {
            return;
        }
        if (this.clipboardService && !this.gridOptionsService.is('suppressClipboardPaste')) {
            this.clipboardService.pasteFromClipboard();
        }
    };
    RowContainerEventsFeature.prototype.onCtrlAndD = function (event) {
        if (this.clipboardService && !this.gridOptionsService.is('suppressClipboardPaste')) {
            this.clipboardService.copyRangeDown();
        }
        event.preventDefault();
    };
    RowContainerEventsFeature.prototype.onCtrlAndZ = function (event) {
        if (!this.gridOptionsService.is('undoRedoCellEditing')) {
            return;
        }
        event.preventDefault();
        if (event.shiftKey) {
            this.undoRedoService.redo('ui');
        }
        else {
            this.undoRedoService.undo('ui');
        }
    };
    RowContainerEventsFeature.prototype.onCtrlAndY = function () {
        this.undoRedoService.redo('ui');
    };
    __decorate([
        context_1.Autowired('mouseEventService')
    ], RowContainerEventsFeature.prototype, "mouseEventService", void 0);
    __decorate([
        context_1.Autowired('valueService')
    ], RowContainerEventsFeature.prototype, "valueService", void 0);
    __decorate([
        context_1.Optional('contextMenuFactory')
    ], RowContainerEventsFeature.prototype, "contextMenuFactory", void 0);
    __decorate([
        context_1.Autowired('ctrlsService')
    ], RowContainerEventsFeature.prototype, "ctrlsService", void 0);
    __decorate([
        context_1.Autowired('navigationService')
    ], RowContainerEventsFeature.prototype, "navigationService", void 0);
    __decorate([
        context_1.Autowired('focusService')
    ], RowContainerEventsFeature.prototype, "focusService", void 0);
    __decorate([
        context_1.Autowired('undoRedoService')
    ], RowContainerEventsFeature.prototype, "undoRedoService", void 0);
    __decorate([
        context_1.Autowired('columnModel')
    ], RowContainerEventsFeature.prototype, "columnModel", void 0);
    __decorate([
        context_1.Autowired('paginationProxy')
    ], RowContainerEventsFeature.prototype, "paginationProxy", void 0);
    __decorate([
        context_1.Autowired('pinnedRowModel')
    ], RowContainerEventsFeature.prototype, "pinnedRowModel", void 0);
    __decorate([
        context_1.Optional('rangeService')
    ], RowContainerEventsFeature.prototype, "rangeService", void 0);
    __decorate([
        context_1.Optional('clipboardService')
    ], RowContainerEventsFeature.prototype, "clipboardService", void 0);
    __decorate([
        context_1.PostConstruct
    ], RowContainerEventsFeature.prototype, "postConstruct", null);
    return RowContainerEventsFeature;
}(beanStub_1.BeanStub));
exports.RowContainerEventsFeature = RowContainerEventsFeature;
