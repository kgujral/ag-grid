"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FilterManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterManager = void 0;
const utils_1 = require("../utils");
const column_1 = require("../entities/column");
const context_1 = require("../context/context");
const events_1 = require("../events");
const moduleNames_1 = require("../modules/moduleNames");
const moduleRegistry_1 = require("../modules/moduleRegistry");
const beanStub_1 = require("../context/beanStub");
const set_1 = require("../utils/set");
const generic_1 = require("../utils/generic");
const object_1 = require("../utils/object");
const dom_1 = require("../utils/dom");
const componentTypes_1 = require("../components/framework/componentTypes");
const gridApi_1 = require("../gridApi");
const function_1 = require("../utils/function");
let FilterManager = FilterManager_1 = class FilterManager extends beanStub_1.BeanStub {
    constructor() {
        super(...arguments);
        this.allColumnFilters = new Map();
        this.allColumnListeners = new Map();
        this.activeAggregateFilters = [];
        this.activeColumnFilters = [];
        this.quickFilter = null;
        this.quickFilterParts = null;
        // this is true when the grid is processing the filter change. this is used by the cell comps, so that they
        // don't flash when data changes due to filter changes. there is no need to flash when filter changes as the
        // user is in control, so doesn't make sense to show flashing changes. for example, go to main demo where
        // this feature is turned off (hack code to always return false for isSuppressFlashingCellsBecauseFiltering(), put in)
        // 100,000 rows and group by country. then do some filtering. all the cells flash, which is silly.
        this.processingFilterChange = false;
        // when we're waiting for cell data types to be inferred, we need to defer filter model updates
        this.filterModelUpdateQueue = [];
    }
    init() {
        this.addManagedListener(this.eventService, events_1.Events.EVENT_GRID_COLUMNS_CHANGED, () => this.onColumnsChanged());
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_VALUE_CHANGED, () => this.refreshFiltersForAggregations());
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_PIVOT_CHANGED, () => this.refreshFiltersForAggregations());
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, () => {
            this.refreshFiltersForAggregations();
            this.resetQuickFilterCache();
        });
        this.addManagedListener(this.eventService, events_1.Events.EVENT_NEW_COLUMNS_LOADED, () => {
            this.resetQuickFilterCache();
            this.updateAdvancedFilterColumns();
        });
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, () => this.resetQuickFilterCache());
        this.addManagedListener(this.eventService, events_1.Events.EVENT_COLUMN_VISIBLE, () => {
            if (!this.gridOptionsService.is('includeHiddenColumnsInQuickFilter')) {
                this.resetQuickFilterCache();
            }
            this.updateAdvancedFilterColumns();
        });
        this.addManagedPropertyListener('quickFilterText', (e) => this.setQuickFilter(e.currentValue));
        this.addManagedPropertyListener('includeHiddenColumnsInQuickFilter', () => this.onIncludeHiddenColumnsInQuickFilterChanged());
        this.quickFilter = this.parseQuickFilter(this.gridOptionsService.get('quickFilterText'));
        this.setQuickFilterParts();
        this.allowShowChangeAfterFilter = this.gridOptionsService.is('allowShowChangeAfterFilter');
        this.externalFilterPresent = this.isExternalFilterPresentCallback();
        this.updateAggFiltering();
        this.addManagedPropertyListener('groupAggFiltering', () => this.updateAggFiltering());
        this.addManagedPropertyListener('advancedFilterModel', (event) => this.setAdvancedFilterModel(event.currentValue));
        this.addManagedListener(this.eventService, events_1.Events.EVENT_ADVANCED_FILTER_ENABLED_CHANGED, ({ enabled }) => this.onAdvancedFilterEnabledChanged(enabled));
        this.addManagedListener(this.eventService, events_1.Events.EVENT_DATA_TYPES_INFERRED, () => this.processFilterModelUpdateQueue());
    }
    isExternalFilterPresentCallback() {
        const isFilterPresent = this.gridOptionsService.getCallback('isExternalFilterPresent');
        if (typeof isFilterPresent === 'function') {
            return isFilterPresent({});
        }
        return false;
    }
    doesExternalFilterPass(node) {
        const doesFilterPass = this.gridOptionsService.get('doesExternalFilterPass');
        if (typeof doesFilterPass === 'function') {
            return doesFilterPass(node);
        }
        return false;
    }
    setQuickFilterParts() {
        this.quickFilterParts = this.quickFilter ? this.quickFilter.split(' ') : null;
    }
    setFilterModel(model) {
        if (this.isAdvancedFilterEnabled()) {
            this.warnAdvancedFilters();
            return;
        }
        if (this.dataTypeService.isPendingInference()) {
            this.filterModelUpdateQueue.push(model);
            return;
        }
        const allPromises = [];
        const previousModel = this.getFilterModel();
        if (model) {
            // mark the filters as we set them, so any active filters left over we stop
            const modelKeys = set_1.convertToSet(Object.keys(model));
            this.allColumnFilters.forEach((filterWrapper, colId) => {
                const newModel = model[colId];
                allPromises.push(this.setModelOnFilterWrapper(filterWrapper.filterPromise, newModel));
                modelKeys.delete(colId);
            });
            // at this point, processedFields contains data for which we don't have a filter working yet
            modelKeys.forEach(colId => {
                const column = this.columnModel.getPrimaryColumn(colId) || this.columnModel.getGridColumn(colId);
                if (!column) {
                    console.warn('AG Grid: setFilterModel() - no column found for colId: ' + colId);
                    return;
                }
                if (!column.isFilterAllowed()) {
                    console.warn('AG Grid: setFilterModel() - unable to fully apply model, filtering disabled for colId: ' + colId);
                    return;
                }
                const filterWrapper = this.getOrCreateFilterWrapper(column, 'NO_UI');
                if (!filterWrapper) {
                    console.warn('AG-Grid: setFilterModel() - unable to fully apply model, unable to create filter for colId: ' + colId);
                    return;
                }
                allPromises.push(this.setModelOnFilterWrapper(filterWrapper.filterPromise, model[colId]));
            });
        }
        else {
            this.allColumnFilters.forEach(filterWrapper => {
                allPromises.push(this.setModelOnFilterWrapper(filterWrapper.filterPromise, null));
            });
        }
        utils_1.AgPromise.all(allPromises).then(() => {
            const currentModel = this.getFilterModel();
            const columns = [];
            this.allColumnFilters.forEach((filterWrapper, colId) => {
                const before = previousModel ? previousModel[colId] : null;
                const after = currentModel ? currentModel[colId] : null;
                if (!utils_1._.jsonEquals(before, after)) {
                    columns.push(filterWrapper.column);
                }
            });
            if (columns.length > 0) {
                this.onFilterChanged({ columns, source: 'api' });
            }
        });
    }
    setModelOnFilterWrapper(filterPromise, newModel) {
        return new utils_1.AgPromise(resolve => {
            filterPromise.then(filter => {
                if (typeof filter.setModel !== 'function') {
                    console.warn('AG Grid: filter missing setModel method, which is needed for setFilterModel');
                    resolve();
                }
                (filter.setModel(newModel) || utils_1.AgPromise.resolve()).then(() => resolve());
            });
        });
    }
    getFilterModel() {
        const result = {};
        this.allColumnFilters.forEach((filterWrapper, key) => {
            // because user can provide filters, we provide useful error checking and messages
            const filterPromise = filterWrapper.filterPromise;
            const filter = filterPromise.resolveNow(null, promiseFilter => promiseFilter);
            if (filter == null) {
                return null;
            }
            if (typeof filter.getModel !== 'function') {
                console.warn('AG Grid: filter API missing getModel method, which is needed for getFilterModel');
                return;
            }
            const model = filter.getModel();
            if (generic_1.exists(model)) {
                result[key] = model;
            }
        });
        return result;
    }
    isColumnFilterPresent() {
        return this.activeColumnFilters.length > 0;
    }
    isAggregateFilterPresent() {
        return !!this.activeAggregateFilters.length;
    }
    isExternalFilterPresent() {
        return this.externalFilterPresent;
    }
    isChildFilterPresent() {
        return this.isColumnFilterPresent()
            || this.isQuickFilterPresent()
            || this.isExternalFilterPresent()
            || this.isAdvancedFilterPresent();
    }
    isAdvancedFilterPresent() {
        return this.isAdvancedFilterEnabled() && this.advancedFilterService.isFilterPresent();
    }
    onAdvancedFilterEnabledChanged(enabled) {
        var _a;
        if (enabled) {
            if (this.allColumnFilters.size) {
                this.allColumnFilters.forEach(filterWrapper => this.disposeFilterWrapper(filterWrapper, 'advancedFilterEnabled'));
                this.onFilterChanged({ source: 'advancedFilter' });
            }
        }
        else {
            if ((_a = this.advancedFilterService) === null || _a === void 0 ? void 0 : _a.isFilterPresent()) {
                this.advancedFilterService.setModel(null);
                this.onFilterChanged({ source: 'advancedFilter' });
            }
        }
    }
    isAdvancedFilterEnabled() {
        var _a;
        return (_a = this.advancedFilterService) === null || _a === void 0 ? void 0 : _a.isEnabled();
    }
    isAdvancedFilterHeaderActive() {
        return this.isAdvancedFilterEnabled() && this.advancedFilterService.isHeaderActive();
    }
    doAggregateFiltersPass(node, filterToSkip) {
        return this.doColumnFiltersPass(node, filterToSkip, true);
    }
    // called by:
    // 1) onFilterChanged()
    // 2) onNewRowsLoaded()
    updateActiveFilters() {
        this.activeColumnFilters.length = 0;
        this.activeAggregateFilters.length = 0;
        const isFilterActive = (filter) => {
            if (!filter) {
                return false;
            } // this never happens, including to avoid compile error
            if (!filter.isFilterActive) {
                console.warn('AG Grid: Filter is missing isFilterActive() method');
                return false;
            }
            return filter.isFilterActive();
        };
        const groupFilterEnabled = !!this.gridOptionsService.getGroupAggFiltering();
        const isAggFilter = (column) => {
            const isSecondary = !column.isPrimary();
            // the only filters that can appear on secondary columns are groupAgg filters
            if (isSecondary) {
                return true;
            }
            const isShowingPrimaryColumns = !this.columnModel.isPivotActive();
            const isValueActive = column.isValueActive();
            // primary columns are only ever groupAgg filters if a) value is active and b) showing primary columns
            if (!isValueActive || !isShowingPrimaryColumns) {
                return false;
            }
            // from here on we know: isPrimary=true, isValueActive=true, isShowingPrimaryColumns=true
            if (this.columnModel.isPivotMode()) {
                // primary column is pretending to be a pivot column, ie pivotMode=true, but we are
                // still showing primary columns
                return true;
            }
            // we are not pivoting, so we groupFilter when it's an agg column
            return groupFilterEnabled;
        };
        this.allColumnFilters.forEach(filterWrapper => {
            if (filterWrapper.filterPromise.resolveNow(false, isFilterActive)) {
                const filterComp = filterWrapper.filterPromise.resolveNow(null, filter => filter);
                if (isAggFilter(filterWrapper.column)) {
                    this.activeAggregateFilters.push(filterComp);
                }
                else {
                    this.activeColumnFilters.push(filterComp);
                }
            }
        });
    }
    updateFilterFlagInColumns(source, additionalEventAttributes) {
        this.allColumnFilters.forEach(filterWrapper => {
            const isFilterActive = filterWrapper.filterPromise.resolveNow(false, filter => filter.isFilterActive());
            filterWrapper.column.setFilterActive(isFilterActive, source, additionalEventAttributes);
        });
    }
    isAnyFilterPresent() {
        return this.isQuickFilterPresent() || this.isColumnFilterPresent() || this.isAggregateFilterPresent() || this.isExternalFilterPresent();
    }
    doColumnFiltersPass(node, filterToSkip, targetAggregates) {
        const { data, aggData } = node;
        const targetedFilters = targetAggregates ? this.activeAggregateFilters : this.activeColumnFilters;
        const targetedData = targetAggregates ? aggData : data;
        for (let i = 0; i < targetedFilters.length; i++) {
            const filter = targetedFilters[i];
            if (filter == null || filter === filterToSkip) {
                continue;
            }
            if (typeof filter.doesFilterPass !== 'function') {
                // because users can do custom filters, give nice error message
                throw new Error('Filter is missing method doesFilterPass');
            }
            if (!filter.doesFilterPass({ node, data: targetedData })) {
                return false;
            }
        }
        return true;
    }
    parseQuickFilter(newFilter) {
        if (!generic_1.exists(newFilter)) {
            return null;
        }
        if (!this.gridOptionsService.isRowModelType('clientSide')) {
            console.warn('AG Grid - Quick filtering only works with the Client-Side Row Model');
            return null;
        }
        return newFilter.toUpperCase();
    }
    setQuickFilter(newFilter) {
        if (newFilter != null && typeof newFilter !== 'string') {
            console.warn(`AG Grid - setQuickFilter() only supports string inputs, received: ${typeof newFilter}`);
            return;
        }
        const parsedFilter = this.parseQuickFilter(newFilter);
        if (this.quickFilter !== parsedFilter) {
            this.quickFilter = parsedFilter;
            this.setQuickFilterParts();
            this.onFilterChanged({ source: 'quickFilter' });
        }
    }
    resetQuickFilterCache() {
        this.rowModel.forEachNode(node => node.quickFilterAggregateText = null);
    }
    onIncludeHiddenColumnsInQuickFilterChanged() {
        this.columnModel.refreshQuickFilterColumns();
        this.resetQuickFilterCache();
        if (this.isQuickFilterPresent()) {
            this.onFilterChanged({ source: 'quickFilter' });
        }
    }
    refreshFiltersForAggregations() {
        const isAggFiltering = this.gridOptionsService.getGroupAggFiltering();
        if (isAggFiltering) {
            this.onFilterChanged();
        }
    }
    // sometimes (especially in React) the filter can call onFilterChanged when we are in the middle
    // of a render cycle. this would be bad, so we wait for render cycle to complete when this happens.
    // this happens in react when we change React State in the grid (eg setting RowCtrl's in RowContainer)
    // which results in React State getting applied in the main application, triggering a useEffect() to
    // be kicked off adn then the application calling the grid's API. in AG-6554, the custom filter was
    // getting it's useEffect() triggered in this way.
    callOnFilterChangedOutsideRenderCycle(params) {
        const action = () => this.onFilterChanged(params);
        if (this.rowRenderer.isRefreshInProgress()) {
            setTimeout(action, 0);
        }
        else {
            action();
        }
    }
    onFilterChanged(params = {}) {
        const { source, filterInstance, additionalEventAttributes, columns } = params;
        this.updateDependantFilters();
        this.updateActiveFilters();
        this.updateFilterFlagInColumns('filterChanged', additionalEventAttributes);
        this.externalFilterPresent = this.isExternalFilterPresentCallback();
        this.allColumnFilters.forEach(filterWrapper => {
            if (!filterWrapper.filterPromise) {
                return;
            }
            filterWrapper.filterPromise.then(filter => {
                if (filter && filter !== filterInstance && filter.onAnyFilterChanged) {
                    filter.onAnyFilterChanged();
                }
            });
        });
        const filterChangedEvent = {
            source,
            type: events_1.Events.EVENT_FILTER_CHANGED,
            columns: columns || [],
        };
        if (additionalEventAttributes) {
            object_1.mergeDeep(filterChangedEvent, additionalEventAttributes);
        }
        // because internal events are not async in ag-grid, when the dispatchEvent
        // method comes back, we know all listeners have finished executing.
        this.processingFilterChange = true;
        this.eventService.dispatchEvent(filterChangedEvent);
        this.processingFilterChange = false;
    }
    isSuppressFlashingCellsBecauseFiltering() {
        // if user has elected to always flash cell changes, then always return false, otherwise we suppress flashing
        // changes when filtering
        return !this.allowShowChangeAfterFilter && this.processingFilterChange;
    }
    isQuickFilterPresent() {
        return this.quickFilter !== null;
    }
    updateAggFiltering() {
        this.aggFiltering = !!this.gridOptionsService.getGroupAggFiltering();
    }
    isAggregateQuickFilterPresent() {
        return this.isQuickFilterPresent() && (this.aggFiltering || this.columnModel.isPivotMode());
    }
    isNonAggregateQuickFilterPresent() {
        return this.isQuickFilterPresent() && !(this.aggFiltering || this.columnModel.isPivotMode());
    }
    doesRowPassOtherFilters(filterToSkip, node) {
        return this.doesRowPassFilter({ rowNode: node, filterInstanceToSkip: filterToSkip });
    }
    doesRowPassQuickFilterNoCache(node, filterPart) {
        const columns = this.columnModel.getAllColumnsForQuickFilter();
        return columns.some(column => {
            const part = this.getQuickFilterTextForColumn(column, node);
            return generic_1.exists(part) && part.indexOf(filterPart) >= 0;
        });
    }
    doesRowPassQuickFilterCache(node, filterPart) {
        if (!node.quickFilterAggregateText) {
            this.aggregateRowForQuickFilter(node);
        }
        return node.quickFilterAggregateText.indexOf(filterPart) >= 0;
    }
    doesRowPassQuickFilter(node) {
        const usingCache = this.gridOptionsService.is('cacheQuickFilter');
        // each part must pass, if any fails, then the whole filter fails
        return this.quickFilterParts.every(part => usingCache ? this.doesRowPassQuickFilterCache(node, part) : this.doesRowPassQuickFilterNoCache(node, part));
    }
    doesRowPassAggregateFilters(params) {
        // check quick filter
        if (this.isAggregateQuickFilterPresent() && !this.doesRowPassQuickFilter(params.rowNode)) {
            return false;
        }
        if (this.isAggregateFilterPresent() && !this.doAggregateFiltersPass(params.rowNode, params.filterInstanceToSkip)) {
            return false;
        }
        // got this far, all filters pass
        return true;
    }
    doesRowPassFilter(params) {
        // the row must pass ALL of the filters, so if any of them fail,
        // we return true. that means if a row passes the quick filter,
        // but fails the column filter, it fails overall
        // first up, check quick filter
        if (this.isNonAggregateQuickFilterPresent() && !this.doesRowPassQuickFilter(params.rowNode)) {
            return false;
        }
        // secondly, give the client a chance to reject this row
        if (this.isExternalFilterPresent() && !this.doesExternalFilterPass(params.rowNode)) {
            return false;
        }
        // lastly, check column filter
        if (this.isColumnFilterPresent() && !this.doColumnFiltersPass(params.rowNode, params.filterInstanceToSkip)) {
            return false;
        }
        if (this.isAdvancedFilterPresent() && !this.advancedFilterService.doesFilterPass(params.rowNode)) {
            return false;
        }
        // got this far, all filters pass
        return true;
    }
    getQuickFilterTextForColumn(column, node) {
        let value = this.valueService.getValue(column, node, true);
        const colDef = column.getColDef();
        if (colDef.getQuickFilterText) {
            const params = {
                value,
                node,
                data: node.data,
                column,
                colDef,
                api: this.gridOptionsService.api,
                columnApi: this.gridOptionsService.columnApi,
                context: this.gridOptionsService.context
            };
            value = colDef.getQuickFilterText(params);
        }
        return generic_1.exists(value) ? value.toString().toUpperCase() : null;
    }
    aggregateRowForQuickFilter(node) {
        const stringParts = [];
        const columns = this.columnModel.getAllColumnsForQuickFilter();
        columns.forEach(column => {
            const part = this.getQuickFilterTextForColumn(column, node);
            if (generic_1.exists(part)) {
                stringParts.push(part);
            }
        });
        node.quickFilterAggregateText = stringParts.join(FilterManager_1.QUICK_FILTER_SEPARATOR);
    }
    onNewRowsLoaded(source) {
        this.allColumnFilters.forEach(filterWrapper => {
            filterWrapper.filterPromise.then(filter => {
                if (filter.onNewRowsLoaded) {
                    filter.onNewRowsLoaded();
                }
            });
        });
        this.updateFilterFlagInColumns(source, { afterDataChange: true });
        this.updateActiveFilters();
    }
    createValueGetter(column) {
        return ({ node }) => this.valueService.getValue(column, node, true);
    }
    getFilterComponent(column, source, createIfDoesNotExist = true) {
        var _a;
        if (createIfDoesNotExist) {
            return ((_a = this.getOrCreateFilterWrapper(column, source)) === null || _a === void 0 ? void 0 : _a.filterPromise) || null;
        }
        const filterWrapper = this.cachedFilter(column);
        return filterWrapper ? filterWrapper.filterPromise : null;
    }
    isFilterActive(column) {
        const filterWrapper = this.cachedFilter(column);
        return !!filterWrapper && filterWrapper.filterPromise.resolveNow(false, filter => filter.isFilterActive());
    }
    getOrCreateFilterWrapper(column, source) {
        if (!column.isFilterAllowed()) {
            return null;
        }
        let filterWrapper = this.cachedFilter(column);
        if (!filterWrapper) {
            filterWrapper = this.createFilterWrapper(column, source);
            const colId = column.getColId();
            this.allColumnFilters.set(colId, filterWrapper);
            this.allColumnListeners.set(colId, this.addManagedListener(column, column_1.Column.EVENT_COL_DEF_CHANGED, () => this.checkDestroyFilter(colId)));
        }
        else if (source !== 'NO_UI') {
            this.putIntoGui(filterWrapper, source);
        }
        return filterWrapper;
    }
    cachedFilter(column) {
        return this.allColumnFilters.get(column.getColId());
    }
    getDefaultFilter(column) {
        let defaultFilter;
        if (moduleRegistry_1.ModuleRegistry.__isRegistered(moduleNames_1.ModuleNames.SetFilterModule, this.context.getGridId())) {
            defaultFilter = 'agSetColumnFilter';
        }
        else {
            const cellDataType = column.getColDef().cellDataType;
            if (cellDataType === 'number') {
                defaultFilter = 'agNumberColumnFilter';
            }
            else if (cellDataType === 'date' || cellDataType === 'dateString') {
                defaultFilter = 'agDateColumnFilter';
            }
            else {
                defaultFilter = 'agTextColumnFilter';
            }
        }
        return defaultFilter;
    }
    getDefaultFloatingFilter(column) {
        let defaultFloatingFilterType;
        if (moduleRegistry_1.ModuleRegistry.__isRegistered(moduleNames_1.ModuleNames.SetFilterModule, this.context.getGridId())) {
            defaultFloatingFilterType = 'agSetColumnFloatingFilter';
        }
        else {
            const cellDataType = column.getColDef().cellDataType;
            if (cellDataType === 'number') {
                defaultFloatingFilterType = 'agNumberColumnFloatingFilter';
            }
            else if (cellDataType === 'date' || cellDataType === 'dateString') {
                defaultFloatingFilterType = 'agDateColumnFloatingFilter';
            }
            else {
                defaultFloatingFilterType = 'agTextColumnFloatingFilter';
            }
        }
        return defaultFloatingFilterType;
    }
    createFilterInstance(column) {
        const defaultFilter = this.getDefaultFilter(column);
        const colDef = column.getColDef();
        let filterInstance;
        const params = Object.assign(Object.assign({}, this.createFilterParams(column, colDef)), { filterModifiedCallback: () => {
                const event = {
                    type: events_1.Events.EVENT_FILTER_MODIFIED,
                    column,
                    filterInstance
                };
                this.eventService.dispatchEvent(event);
            }, filterChangedCallback: (additionalEventAttributes) => {
                var _a;
                const source = (_a = additionalEventAttributes === null || additionalEventAttributes === void 0 ? void 0 : additionalEventAttributes.source) !== null && _a !== void 0 ? _a : 'api';
                const params = {
                    filterInstance,
                    additionalEventAttributes,
                    columns: [column],
                    source,
                };
                this.callOnFilterChangedOutsideRenderCycle(params);
            }, doesRowPassOtherFilter: node => this.doesRowPassOtherFilters(filterInstance, node) });
        const compDetails = this.userComponentFactory.getFilterDetails(colDef, params, defaultFilter);
        if (!compDetails) {
            return { filterPromise: null, compDetails: null };
        }
        return {
            filterPromise: () => {
                const filterPromise = compDetails.newAgStackInstance();
                if (filterPromise) {
                    filterPromise.then(r => filterInstance = r);
                }
                return filterPromise;
            },
            compDetails
        };
    }
    createFilterParams(column, colDef) {
        const params = {
            column,
            colDef: object_1.cloneObject(colDef),
            rowModel: this.rowModel,
            filterChangedCallback: () => { },
            filterModifiedCallback: () => { },
            valueGetter: this.createValueGetter(column),
            doesRowPassOtherFilter: () => true,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            context: this.gridOptionsService.context,
        };
        return params;
    }
    createFilterWrapper(column, source) {
        var _a;
        const filterWrapper = {
            column: column,
            filterPromise: null,
            compiledElement: null,
            guiPromise: utils_1.AgPromise.resolve(null),
            compDetails: null
        };
        const { filterPromise, compDetails } = this.createFilterInstance(column);
        filterWrapper.filterPromise = (_a = filterPromise === null || filterPromise === void 0 ? void 0 : filterPromise()) !== null && _a !== void 0 ? _a : null;
        filterWrapper.compDetails = compDetails;
        if (filterPromise) {
            this.putIntoGui(filterWrapper, source);
        }
        return filterWrapper;
    }
    putIntoGui(filterWrapper, source) {
        const eFilterGui = document.createElement('div');
        eFilterGui.className = 'ag-filter';
        filterWrapper.guiPromise = new utils_1.AgPromise(resolve => {
            filterWrapper.filterPromise.then(filter => {
                let guiFromFilter = filter.getGui();
                if (!generic_1.exists(guiFromFilter)) {
                    console.warn(`AG Grid: getGui method from filter returned ${guiFromFilter}, it should be a DOM element or an HTML template string.`);
                }
                // for backwards compatibility with Angular 1 - we
                // used to allow providing back HTML from getGui().
                // once we move away from supporting Angular 1
                // directly, we can change this.
                if (typeof guiFromFilter === 'string') {
                    guiFromFilter = dom_1.loadTemplate(guiFromFilter);
                }
                eFilterGui.appendChild(guiFromFilter);
                resolve(eFilterGui);
                const event = {
                    type: events_1.Events.EVENT_FILTER_OPENED,
                    column: filterWrapper.column,
                    source,
                    eGui: eFilterGui
                };
                this.eventService.dispatchEvent(event);
            });
        });
    }
    onColumnsChanged() {
        const columns = [];
        this.allColumnFilters.forEach((wrapper, colId) => {
            let currentColumn;
            if (wrapper.column.isPrimary()) {
                currentColumn = this.columnModel.getPrimaryColumn(colId);
            }
            else {
                currentColumn = this.columnModel.getGridColumn(colId);
            }
            if (currentColumn) {
                return;
            }
            columns.push(wrapper.column);
            this.disposeFilterWrapper(wrapper, 'columnChanged');
            this.disposeColumnListener(colId);
        });
        if (columns.length > 0) {
            // When a filter changes as a side effect of a column changes,
            // we report 'api' as the source, so that the client can distinguish
            this.onFilterChanged({ columns, source: 'api' });
        }
        else {
            // onFilterChanged does this already
            this.updateDependantFilters();
        }
    }
    updateDependantFilters() {
        // Group column filters can be dependant on underlying column filters, but don't normally get created until they're used for the first time.
        // Instead, create them by default when any filter changes.
        const groupColumns = this.columnModel.getGroupAutoColumns();
        groupColumns === null || groupColumns === void 0 ? void 0 : groupColumns.forEach(groupColumn => {
            if (groupColumn.getColDef().filter === 'agGroupColumnFilter') {
                this.getOrCreateFilterWrapper(groupColumn, 'NO_UI');
            }
        });
    }
    // for group filters, can change dynamically whether they are allowed or not
    isFilterAllowed(column) {
        var _a, _b;
        if (this.isAdvancedFilterEnabled()) {
            return false;
        }
        const isFilterAllowed = column.isFilterAllowed();
        if (!isFilterAllowed) {
            return false;
        }
        const filterWrapper = this.allColumnFilters.get(column.getColId());
        return (_b = (_a = filterWrapper === null || filterWrapper === void 0 ? void 0 : filterWrapper.filterPromise) === null || _a === void 0 ? void 0 : _a.resolveNow(true, 
        // defer to filter component isFilterAllowed if it exists
        filter => {
            var _a, _b;
            return (typeof ((_a = filter) === null || _a === void 0 ? void 0 : _a.isFilterAllowed) === 'function')
                ? (_b = filter) === null || _b === void 0 ? void 0 : _b.isFilterAllowed()
                : true;
        })) !== null && _b !== void 0 ? _b : true;
    }
    getFloatingFilterCompDetails(column, showParentFilter) {
        const colDef = column.getColDef();
        const filterParams = this.createFilterParams(column, colDef);
        const finalFilterParams = this.userComponentFactory.mergeParamsWithApplicationProvidedParams(colDef, componentTypes_1.FilterComponent, filterParams);
        let defaultFloatingFilterType = this.userComponentFactory.getDefaultFloatingFilterType(colDef, () => this.getDefaultFloatingFilter(column));
        if (defaultFloatingFilterType == null) {
            defaultFloatingFilterType = 'agReadOnlyFloatingFilter';
        }
        const parentFilterInstance = (callback) => {
            const filterComponent = this.getFilterComponent(column, 'NO_UI');
            if (filterComponent == null) {
                return;
            }
            filterComponent.then(instance => {
                callback(gridApi_1.unwrapUserComp(instance));
            });
        };
        const params = {
            column: column,
            filterParams: finalFilterParams,
            currentParentModel: () => this.getCurrentFloatingFilterParentModel(column),
            parentFilterInstance,
            showParentFilter,
            suppressFilterButton: false // This one might be overridden from the colDef
        };
        return this.userComponentFactory.getFloatingFilterCompDetails(colDef, params, defaultFloatingFilterType);
    }
    getCurrentFloatingFilterParentModel(column) {
        const filterComponent = this.getFilterComponent(column, 'NO_UI', false);
        return filterComponent ? filterComponent.resolveNow(null, filter => filter && filter.getModel()) : null;
    }
    // destroys the filter, so it no longer takes part
    destroyFilter(column, source = 'api') {
        const colId = column.getColId();
        const filterWrapper = this.allColumnFilters.get(colId);
        this.disposeColumnListener(colId);
        if (filterWrapper) {
            this.disposeFilterWrapper(filterWrapper, source);
            this.onFilterChanged({
                columns: [column],
                source: 'api',
            });
        }
    }
    disposeColumnListener(colId) {
        const columnListener = this.allColumnListeners.get(colId);
        if (columnListener) {
            this.allColumnListeners.delete(colId);
            columnListener();
        }
    }
    disposeFilterWrapper(filterWrapper, source) {
        filterWrapper.filterPromise.then(filter => {
            (filter.setModel(null) || utils_1.AgPromise.resolve()).then(() => {
                this.getContext().destroyBean(filter);
                filterWrapper.column.setFilterActive(false, 'filterDestroyed');
                this.allColumnFilters.delete(filterWrapper.column.getColId());
                const event = {
                    type: events_1.Events.EVENT_FILTER_DESTROYED,
                    source,
                    column: filterWrapper.column,
                };
                this.eventService.dispatchEvent(event);
            });
        });
    }
    checkDestroyFilter(colId) {
        const filterWrapper = this.allColumnFilters.get(colId);
        if (!filterWrapper) {
            return;
        }
        const column = filterWrapper.column;
        const { compDetails } = column.isFilterAllowed()
            ? this.createFilterInstance(column)
            : { compDetails: null };
        if (this.areFilterCompsDifferent(filterWrapper.compDetails, compDetails)) {
            this.destroyFilter(column, 'columnChanged');
        }
    }
    areFilterCompsDifferent(oldCompDetails, newCompDetails) {
        if (!newCompDetails || !oldCompDetails) {
            return true;
        }
        const { componentClass: oldComponentClass } = oldCompDetails;
        const { componentClass: newComponentClass } = newCompDetails;
        const isSameComponentClass = oldComponentClass === newComponentClass ||
            // react hooks returns new wrappers, so check nested render method
            ((oldComponentClass === null || oldComponentClass === void 0 ? void 0 : oldComponentClass.render) && (newComponentClass === null || newComponentClass === void 0 ? void 0 : newComponentClass.render) &&
                oldComponentClass.render === newComponentClass.render);
        return !isSameComponentClass;
    }
    getAdvancedFilterModel() {
        return this.isAdvancedFilterEnabled() ? this.advancedFilterService.getModel() : null;
    }
    setAdvancedFilterModel(expression) {
        if (!this.isAdvancedFilterEnabled()) {
            return;
        }
        this.advancedFilterService.setModel(expression);
        this.onFilterChanged({ source: 'advancedFilter' });
    }
    updateAdvancedFilterColumns() {
        if (!this.isAdvancedFilterEnabled()) {
            return;
        }
        if (this.advancedFilterService.updateValidity()) {
            this.onFilterChanged({ source: 'advancedFilter' });
        }
    }
    hasFloatingFilters() {
        if (this.isAdvancedFilterEnabled()) {
            return false;
        }
        const gridColumns = this.columnModel.getAllGridColumns();
        if (!gridColumns) {
            return false;
        }
        return gridColumns.some(col => col.getColDef().floatingFilter);
    }
    getFilterInstance(key, callback) {
        if (this.isAdvancedFilterEnabled()) {
            this.warnAdvancedFilters();
            return undefined;
        }
        const res = this.getFilterInstanceImpl(key, instance => {
            if (!callback) {
                return;
            }
            const unwrapped = gridApi_1.unwrapUserComp(instance);
            callback(unwrapped);
        });
        const unwrapped = gridApi_1.unwrapUserComp(res);
        return unwrapped;
    }
    getFilterInstanceImpl(key, callback) {
        const column = this.columnModel.getPrimaryColumn(key);
        if (!column) {
            return undefined;
        }
        const filterPromise = this.getFilterComponent(column, 'NO_UI');
        const currentValue = filterPromise && filterPromise.resolveNow(null, filterComp => filterComp);
        if (currentValue) {
            setTimeout(callback, 0, currentValue);
        }
        else if (filterPromise) {
            filterPromise.then(comp => {
                callback(comp);
            });
        }
        return currentValue;
    }
    warnAdvancedFilters() {
        function_1.doOnce(() => {
            console.warn('AG Grid: Column Filter API methods have been disabled as Advanced Filters are enabled.');
        }, 'advancedFiltersCompatibility');
    }
    setupAdvancedFilterHeaderComp(eCompToInsertBefore) {
        var _a;
        (_a = this.advancedFilterService) === null || _a === void 0 ? void 0 : _a.getCtrl().setupHeaderComp(eCompToInsertBefore);
    }
    getHeaderRowCount() {
        return this.isAdvancedFilterHeaderActive() ? 1 : 0;
    }
    getHeaderHeight() {
        return this.isAdvancedFilterHeaderActive() ? this.advancedFilterService.getCtrl().getHeaderHeight() : 0;
    }
    processFilterModelUpdateQueue() {
        this.filterModelUpdateQueue.forEach(model => this.setFilterModel(model));
        this.filterModelUpdateQueue = [];
    }
    destroy() {
        super.destroy();
        this.allColumnFilters.forEach(filterWrapper => this.disposeFilterWrapper(filterWrapper, 'gridDestroyed'));
        // don't need to destroy the listeners as they are managed listeners
        this.allColumnListeners.clear();
    }
};
FilterManager.QUICK_FILTER_SEPARATOR = '\n';
__decorate([
    context_1.Autowired('valueService')
], FilterManager.prototype, "valueService", void 0);
__decorate([
    context_1.Autowired('columnModel')
], FilterManager.prototype, "columnModel", void 0);
__decorate([
    context_1.Autowired('rowModel')
], FilterManager.prototype, "rowModel", void 0);
__decorate([
    context_1.Autowired('userComponentFactory')
], FilterManager.prototype, "userComponentFactory", void 0);
__decorate([
    context_1.Autowired('rowRenderer')
], FilterManager.prototype, "rowRenderer", void 0);
__decorate([
    context_1.Autowired('dataTypeService')
], FilterManager.prototype, "dataTypeService", void 0);
__decorate([
    context_1.Optional('advancedFilterService')
], FilterManager.prototype, "advancedFilterService", void 0);
__decorate([
    context_1.PostConstruct
], FilterManager.prototype, "init", null);
FilterManager = FilterManager_1 = __decorate([
    context_1.Bean('filterManager')
], FilterManager);
exports.FilterManager = FilterManager;
