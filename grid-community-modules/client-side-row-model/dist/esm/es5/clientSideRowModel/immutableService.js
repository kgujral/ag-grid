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
import { Autowired, Bean, BeanStub, PostConstruct, _ } from "@ag-grid-community/core";
var ImmutableService = /** @class */ (function (_super) {
    __extends(ImmutableService, _super);
    function ImmutableService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImmutableService.prototype.postConstruct = function () {
        if (this.rowModel.getType() === 'clientSide') {
            this.clientSideRowModel = this.rowModel;
        }
    };
    ImmutableService.prototype.isActive = function () {
        var getRowIdProvided = this.gridOptionsService.exists('getRowId');
        // this property is a backwards compatibility property, for those who want
        // the old behaviour of Row ID's but NOT Immutable Data.
        var resetRowDataOnUpdate = this.gridOptionsService.is('resetRowDataOnUpdate');
        if (resetRowDataOnUpdate) {
            return false;
        }
        return getRowIdProvided;
    };
    ImmutableService.prototype.setRowData = function (rowData) {
        var transactionAndMap = this.createTransactionForRowData(rowData);
        if (!transactionAndMap) {
            return;
        }
        var _a = __read(transactionAndMap, 2), transaction = _a[0], orderIdMap = _a[1];
        this.clientSideRowModel.updateRowData(transaction, orderIdMap);
    };
    // converts the setRowData() command to a transaction
    ImmutableService.prototype.createTransactionForRowData = function (rowData) {
        if (_.missing(this.clientSideRowModel)) {
            console.error('AG Grid: ImmutableService only works with ClientSideRowModel');
            return;
        }
        var getRowIdFunc = this.gridOptionsService.getCallback('getRowId');
        if (getRowIdFunc == null) {
            console.error('AG Grid: ImmutableService requires getRowId() callback to be implemented, your row data needs IDs!');
            return;
        }
        // convert the data into a transaction object by working out adds, removes and updates
        var transaction = {
            remove: [],
            update: [],
            add: []
        };
        var existingNodesMap = this.clientSideRowModel.getCopyOfNodesMap();
        var suppressSortOrder = this.gridOptionsService.is('suppressMaintainUnsortedOrder');
        var orderMap = suppressSortOrder ? undefined : {};
        if (_.exists(rowData)) {
            // split all the new data in the following:
            // if new, push to 'add'
            // if update, push to 'update'
            // if not changed, do not include in the transaction
            rowData.forEach(function (data, index) {
                var id = getRowIdFunc({ data: data, level: 0 });
                var existingNode = existingNodesMap[id];
                if (orderMap) {
                    orderMap[id] = index;
                }
                if (existingNode) {
                    var dataHasChanged = existingNode.data !== data;
                    if (dataHasChanged) {
                        transaction.update.push(data);
                    }
                    // otherwise, if data not changed, we just don't include it anywhere, as it's not a delta
                    // remove from list, so we know the item is not to be removed
                    existingNodesMap[id] = undefined;
                }
                else {
                    transaction.add.push(data);
                }
            });
        }
        // at this point, all rows that are left, should be removed
        _.iterateObject(existingNodesMap, function (id, rowNode) {
            if (rowNode) {
                transaction.remove.push(rowNode.data);
            }
        });
        return [transaction, orderMap];
    };
    __decorate([
        Autowired('rowModel')
    ], ImmutableService.prototype, "rowModel", void 0);
    __decorate([
        Autowired('rowRenderer')
    ], ImmutableService.prototype, "rowRenderer", void 0);
    __decorate([
        PostConstruct
    ], ImmutableService.prototype, "postConstruct", null);
    ImmutableService = __decorate([
        Bean('immutableService')
    ], ImmutableService);
    return ImmutableService;
}(BeanStub));
export { ImmutableService };
