"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeDetectionService = void 0;
const beanStub_1 = require("../context/beanStub");
const context_1 = require("../context/context");
const changedPath_1 = require("../utils/changedPath");
const events_1 = require("../events");
// Matches value in clipboard module
const SOURCE_PASTE = 'paste';
let ChangeDetectionService = class ChangeDetectionService extends beanStub_1.BeanStub {
    init() {
        if (this.rowModel.getType() === 'clientSide') {
            this.clientSideRowModel = this.rowModel;
        }
        this.addManagedListener(this.eventService, events_1.Events.EVENT_CELL_VALUE_CHANGED, this.onCellValueChanged.bind(this));
    }
    onCellValueChanged(event) {
        // Clipboard service manages its own change detection, so no need to do it here.
        // The clipboard manages its own as otherwise this would happen once for every cell
        // that got updated as part of a paste operation, so e.g. if 100 cells in a paste operation,
        // this doChangeDetection would get called 100 times (once for each cell), instead clipboard
        // service executes the logic we have here once (in essence batching up all cell changes
        // into one change detection).
        if (event.source === SOURCE_PASTE) {
            return;
        }
        this.doChangeDetection(event.node, event.column);
    }
    doChangeDetection(rowNode, column) {
        if (this.gridOptionsService.is('suppressChangeDetection')) {
            return;
        }
        const nodesToRefresh = [rowNode];
        // step 1 of change detection is to update the aggregated values
        if (this.clientSideRowModel && !rowNode.isRowPinned()) {
            const onlyChangedColumns = this.gridOptionsService.is('aggregateOnlyChangedColumns');
            const changedPath = new changedPath_1.ChangedPath(onlyChangedColumns, this.clientSideRowModel.getRootNode());
            changedPath.addParentNode(rowNode.parent, [column]);
            this.clientSideRowModel.doAggregate(changedPath);
            // add all nodes impacted by aggregation, as they need refreshed also.
            changedPath.forEachChangedNodeDepthFirst(rowNode => {
                nodesToRefresh.push(rowNode);
            });
        }
        // step 2 of change detection is to refresh the cells
        this.rowRenderer.refreshCells({ rowNodes: nodesToRefresh });
    }
};
__decorate([
    context_1.Autowired('rowModel')
], ChangeDetectionService.prototype, "rowModel", void 0);
__decorate([
    context_1.Autowired('rowRenderer')
], ChangeDetectionService.prototype, "rowRenderer", void 0);
__decorate([
    context_1.PostConstruct
], ChangeDetectionService.prototype, "init", null);
ChangeDetectionService = __decorate([
    context_1.Bean('changeDetectionService')
], ChangeDetectionService);
exports.ChangeDetectionService = ChangeDetectionService;
