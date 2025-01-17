"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = exports.getNextColInstanceId = void 0;
const eventService_1 = require("../eventService");
const context_1 = require("../context/context");
const moduleNames_1 = require("../modules/moduleNames");
const moduleRegistry_1 = require("../modules/moduleRegistry");
const generic_1 = require("../utils/generic");
const function_1 = require("../utils/function");
const object_1 = require("../utils/object");
let instanceIdSequence = 0;
function getNextColInstanceId() {
    return instanceIdSequence++;
}
exports.getNextColInstanceId = getNextColInstanceId;
// Wrapper around a user provide column definition. The grid treats the column definition as ready only.
// This class contains all the runtime information about a column, plus some logic (the definition has no logic).
// This class implements both interfaces ColumnGroupChild and ProvidedColumnGroupChild as the class can
// appear as a child of either the original tree or the displayed tree. However the relevant group classes
// for each type only implements one, as each group can only appear in it's associated tree (eg ProvidedColumnGroup
// can only appear in OriginalColumn tree).
class Column {
    constructor(colDef, userProvidedColDef, colId, primary) {
        // used by React (and possibly other frameworks) as key for rendering. also used to
        // identify old vs new columns for destroying cols when no longer used.
        this.instanceId = getNextColInstanceId();
        // The measured height of this column's header when autoHeaderHeight is enabled
        this.autoHeaderHeight = null;
        this.moving = false;
        this.menuVisible = false;
        this.lastLeftPinned = false;
        this.firstRightPinned = false;
        this.filterActive = false;
        this.eventService = new eventService_1.EventService();
        this.tooltipEnabled = false;
        this.rowGroupActive = false;
        this.pivotActive = false;
        this.aggregationActive = false;
        this.colDef = colDef;
        this.userProvidedColDef = userProvidedColDef;
        this.colId = colId;
        this.primary = primary;
        this.setState(colDef);
    }
    getInstanceId() {
        return this.instanceId;
    }
    setState(colDef) {
        // sort
        if (colDef.sort !== undefined) {
            if (colDef.sort === 'asc' || colDef.sort === 'desc') {
                this.sort = colDef.sort;
            }
        }
        else {
            if (colDef.initialSort === 'asc' || colDef.initialSort === 'desc') {
                this.sort = colDef.initialSort;
            }
        }
        // sortIndex
        const sortIndex = generic_1.attrToNumber(colDef.sortIndex);
        const initialSortIndex = generic_1.attrToNumber(colDef.initialSortIndex);
        if (sortIndex !== undefined) {
            if (sortIndex !== null) {
                this.sortIndex = sortIndex;
            }
        }
        else {
            if (initialSortIndex !== null) {
                this.sortIndex = initialSortIndex;
            }
        }
        // hide
        const hide = generic_1.attrToBoolean(colDef.hide);
        const initialHide = generic_1.attrToBoolean(colDef.initialHide);
        if (hide !== undefined) {
            this.visible = !hide;
        }
        else {
            this.visible = !initialHide;
        }
        // pinned
        if (colDef.pinned !== undefined) {
            this.setPinned(colDef.pinned);
        }
        else {
            this.setPinned(colDef.initialPinned);
        }
        // flex
        const flex = generic_1.attrToNumber(colDef.flex);
        const initialFlex = generic_1.attrToNumber(colDef.initialFlex);
        if (flex !== undefined) {
            this.flex = flex;
        }
        else if (initialFlex !== undefined) {
            this.flex = initialFlex;
        }
    }
    // gets called when user provides an alternative colDef, eg
    setColDef(colDef, userProvidedColDef) {
        this.colDef = colDef;
        this.userProvidedColDef = userProvidedColDef;
        this.initMinAndMaxWidths();
        this.initDotNotation();
        this.eventService.dispatchEvent(this.createColumnEvent('colDefChanged', "api"));
    }
    /**
     * Returns the column definition provided by the application.
     * This may not be correct, as items can be superseded by default column options.
     * However it's useful for comparison, eg to know which application column definition matches that column.
     */
    getUserProvidedColDef() {
        return this.userProvidedColDef;
    }
    setParent(parent) {
        this.parent = parent;
    }
    /** Returns the parent column group, if column grouping is active. */
    getParent() {
        return this.parent;
    }
    setOriginalParent(originalParent) {
        this.originalParent = originalParent;
    }
    /**
     * Used for marryChildren, helps with comparing when duplicate groups have been created to manage split groups.
     *
     * Parent may contain a duplicate but not identical group when the group is split.
     */
    getOriginalParent() {
        return this.originalParent;
    }
    // this is done after constructor as it uses gridOptionsService
    initialise() {
        this.initMinAndMaxWidths();
        this.resetActualWidth('gridInitializing');
        this.initDotNotation();
        this.initTooltip();
        this.validate();
    }
    initDotNotation() {
        const suppressDotNotation = this.gridOptionsService.is('suppressFieldDotNotation');
        this.fieldContainsDots = generic_1.exists(this.colDef.field) && this.colDef.field.indexOf('.') >= 0 && !suppressDotNotation;
        this.tooltipFieldContainsDots = generic_1.exists(this.colDef.tooltipField) && this.colDef.tooltipField.indexOf('.') >= 0 && !suppressDotNotation;
    }
    initMinAndMaxWidths() {
        const colDef = this.colDef;
        this.minWidth = this.columnUtils.calculateColMinWidth(colDef);
        this.maxWidth = this.columnUtils.calculateColMaxWidth(colDef);
    }
    initTooltip() {
        this.tooltipEnabled = generic_1.exists(this.colDef.tooltipField) ||
            generic_1.exists(this.colDef.tooltipValueGetter) ||
            generic_1.exists(this.colDef.tooltipComponent);
    }
    resetActualWidth(source = 'api') {
        const initialWidth = this.columnUtils.calculateColInitialWidth(this.colDef);
        this.setActualWidth(initialWidth, source, true);
    }
    isEmptyGroup() {
        return false;
    }
    isRowGroupDisplayed(colId) {
        if (generic_1.missing(this.colDef) || generic_1.missing(this.colDef.showRowGroup)) {
            return false;
        }
        const showingAllGroups = this.colDef.showRowGroup === true;
        const showingThisGroup = this.colDef.showRowGroup === colId;
        return showingAllGroups || showingThisGroup;
    }
    /** Returns `true` if column is a primary column, `false` if secondary. Secondary columns are used for pivoting. */
    isPrimary() {
        return this.primary;
    }
    /** Returns `true` if column filtering is allowed. */
    isFilterAllowed() {
        // filter defined means it's a string, class or true.
        // if its false, null or undefined then it's false.
        const filterDefined = !!this.colDef.filter;
        return filterDefined;
    }
    isFieldContainsDots() {
        return this.fieldContainsDots;
    }
    isTooltipEnabled() {
        return this.tooltipEnabled;
    }
    isTooltipFieldContainsDots() {
        return this.tooltipFieldContainsDots;
    }
    validate() {
        const colDefAny = this.colDef;
        function warnOnce(msg, key, obj) {
            function_1.doOnce(() => {
                if (obj) {
                    console.warn(msg, obj);
                }
                else {
                    function_1.doOnce(() => console.warn(msg), key);
                }
            }, key);
        }
        const usingCSRM = this.gridOptionsService.isRowModelType('clientSide');
        if (usingCSRM && !moduleRegistry_1.ModuleRegistry.__isRegistered(moduleNames_1.ModuleNames.RowGroupingModule, this.gridOptionsService.getGridId())) {
            const rowGroupingItems = ['enableRowGroup', 'rowGroup', 'rowGroupIndex', 'enablePivot', 'enableValue', 'pivot', 'pivotIndex', 'aggFunc'];
            const itemsUsed = rowGroupingItems.filter(x => generic_1.exists(colDefAny[x]));
            if (itemsUsed.length > 0) {
                moduleRegistry_1.ModuleRegistry.__assertRegistered(moduleNames_1.ModuleNames.RowGroupingModule, itemsUsed.map(i => 'colDef.' + i).join(', '), this.gridOptionsService.getGridId());
            }
        }
        if (this.colDef.cellEditor === 'agRichSelect' || this.colDef.cellEditor === 'agRichSelectCellEditor') {
            moduleRegistry_1.ModuleRegistry.__assertRegistered(moduleNames_1.ModuleNames.RichSelectModule, this.colDef.cellEditor, this.gridOptionsService.getGridId());
        }
        if (this.gridOptionsService.isTreeData()) {
            const itemsNotAllowedWithTreeData = ['rowGroup', 'rowGroupIndex', 'pivot', 'pivotIndex'];
            const itemsUsed = itemsNotAllowedWithTreeData.filter(x => generic_1.exists(colDefAny[x]));
            if (itemsUsed.length > 0) {
                warnOnce(`AG Grid: ${itemsUsed.join()} is not possible when doing tree data, your column definition should not have ${itemsUsed.join()}`, 'TreeDataCannotRowGroup');
            }
        }
        if (generic_1.exists(colDefAny.menuTabs)) {
            if (Array.isArray(colDefAny.menuTabs)) {
                const communityMenuTabs = ['filterMenuTab'];
                const enterpriseMenuTabs = ['columnsMenuTab', 'generalMenuTab'];
                const itemsUsed = enterpriseMenuTabs.filter(x => colDefAny.menuTabs.includes(x));
                if (itemsUsed.length > 0) {
                    moduleRegistry_1.ModuleRegistry.__assertRegistered(moduleNames_1.ModuleNames.MenuModule, `menuTab(s): ${itemsUsed.map(t => `'${t}'`).join()}`, this.gridOptionsService.getGridId());
                }
                colDefAny.menuTabs.forEach((tab) => {
                    if (!enterpriseMenuTabs.includes(tab) && !communityMenuTabs.includes(tab)) {
                        warnOnce(`AG Grid: '${tab}' is not valid for 'colDef.menuTabs'. Valid values are: ${[...communityMenuTabs, ...enterpriseMenuTabs].map(t => `'${t}'`).join()}.`, 'wrongValue_menuTabs_' + tab);
                    }
                });
            }
            else {
                warnOnce(`AG Grid: The typeof 'colDef.menuTabs' should be an array not:` + typeof colDefAny.menuTabs, 'wrongType_menuTabs');
            }
        }
        if (generic_1.exists(colDefAny.columnsMenuParams)) {
            moduleRegistry_1.ModuleRegistry.__assertRegistered(moduleNames_1.ModuleNames.MenuModule, 'columnsMenuParams', this.gridOptionsService.getGridId());
        }
        if (generic_1.exists(colDefAny.columnsMenuParams)) {
            moduleRegistry_1.ModuleRegistry.__assertRegistered(moduleNames_1.ModuleNames.ColumnsToolPanelModule, 'columnsMenuParams', this.gridOptionsService.getGridId());
        }
        if (generic_1.exists(this.colDef.width) && typeof this.colDef.width !== 'number') {
            warnOnce('AG Grid: colDef.width should be a number, not ' + typeof this.colDef.width, 'ColumnCheck');
        }
        if (generic_1.exists(colDefAny.columnGroupShow) && colDefAny.columnGroupShow !== 'closed' && colDefAny.columnGroupShow !== 'open') {
            warnOnce(`AG Grid: '${colDefAny.columnGroupShow}' is not valid for columnGroupShow. Valid values are 'open', 'closed', undefined, null`, 'columnGroupShow_invalid');
        }
    }
    /** Add an event listener to the column. */
    addEventListener(eventType, listener) {
        this.eventService.addEventListener(eventType, listener);
    }
    /** Remove event listener from the column. */
    removeEventListener(eventType, listener) {
        this.eventService.removeEventListener(eventType, listener);
    }
    createColumnFunctionCallbackParams(rowNode) {
        return {
            node: rowNode,
            data: rowNode.data,
            column: this,
            colDef: this.colDef,
            context: this.gridOptionsService.context,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi
        };
    }
    isSuppressNavigable(rowNode) {
        // if boolean set, then just use it
        if (typeof this.colDef.suppressNavigable === 'boolean') {
            return this.colDef.suppressNavigable;
        }
        // if function, then call the function to find out
        if (typeof this.colDef.suppressNavigable === 'function') {
            const params = this.createColumnFunctionCallbackParams(rowNode);
            const userFunc = this.colDef.suppressNavigable;
            return userFunc(params);
        }
        return false;
    }
    /**
     * Returns `true` if the cell for this column is editable for the given `rowNode`, otherwise `false`.
     */
    isCellEditable(rowNode) {
        // only allow editing of groups if the user has this option enabled
        if (rowNode.group && !this.gridOptionsService.is('enableGroupEdit')) {
            return false;
        }
        return this.isColumnFunc(rowNode, this.colDef.editable);
    }
    isSuppressFillHandle() {
        return !!generic_1.attrToBoolean(this.colDef.suppressFillHandle);
    }
    isAutoHeight() {
        return !!generic_1.attrToBoolean(this.colDef.autoHeight);
    }
    isAutoHeaderHeight() {
        return !!generic_1.attrToBoolean(this.colDef.autoHeaderHeight);
    }
    isRowDrag(rowNode) {
        return this.isColumnFunc(rowNode, this.colDef.rowDrag);
    }
    isDndSource(rowNode) {
        return this.isColumnFunc(rowNode, this.colDef.dndSource);
    }
    isCellCheckboxSelection(rowNode) {
        return this.isColumnFunc(rowNode, this.colDef.checkboxSelection);
    }
    isSuppressPaste(rowNode) {
        return this.isColumnFunc(rowNode, this.colDef ? this.colDef.suppressPaste : null);
    }
    isResizable() {
        return !!generic_1.attrToBoolean(this.colDef.resizable);
    }
    isColumnFunc(rowNode, value) {
        // if boolean set, then just use it
        if (typeof value === 'boolean') {
            return value;
        }
        // if function, then call the function to find out
        if (typeof value === 'function') {
            const params = this.createColumnFunctionCallbackParams(rowNode);
            const editableFunc = value;
            return editableFunc(params);
        }
        return false;
    }
    setMoving(moving, source = "api") {
        this.moving = moving;
        this.eventService.dispatchEvent(this.createColumnEvent('movingChanged', source));
    }
    createColumnEvent(type, source) {
        return {
            type: type,
            column: this,
            columns: [this],
            source: source,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            context: this.gridOptionsService.context
        };
    }
    isMoving() {
        return this.moving;
    }
    /** If sorting is active, returns the sort direction e.g. `'asc'` or `'desc'`. */
    getSort() {
        return this.sort;
    }
    setSort(sort, source = "api") {
        if (this.sort !== sort) {
            this.sort = sort;
            this.eventService.dispatchEvent(this.createColumnEvent('sortChanged', source));
        }
        this.dispatchStateUpdatedEvent('sort');
    }
    setMenuVisible(visible, source = "api") {
        if (this.menuVisible !== visible) {
            this.menuVisible = visible;
            this.eventService.dispatchEvent(this.createColumnEvent('menuVisibleChanged', source));
        }
    }
    isMenuVisible() {
        return this.menuVisible;
    }
    isSortAscending() {
        return this.sort === 'asc';
    }
    isSortDescending() {
        return this.sort === 'desc';
    }
    isSortNone() {
        return generic_1.missing(this.sort);
    }
    isSorting() {
        return generic_1.exists(this.sort);
    }
    getSortIndex() {
        return this.sortIndex;
    }
    setSortIndex(sortOrder) {
        this.sortIndex = sortOrder;
        this.dispatchStateUpdatedEvent('sortIndex');
    }
    setAggFunc(aggFunc) {
        this.aggFunc = aggFunc;
        this.dispatchStateUpdatedEvent('aggFunc');
    }
    /** If aggregation is set for the column, returns the aggregation function. */
    getAggFunc() {
        return this.aggFunc;
    }
    getLeft() {
        return this.left;
    }
    getOldLeft() {
        return this.oldLeft;
    }
    getRight() {
        return this.left + this.actualWidth;
    }
    setLeft(left, source = "api") {
        this.oldLeft = this.left;
        if (this.left !== left) {
            this.left = left;
            this.eventService.dispatchEvent(this.createColumnEvent('leftChanged', source));
        }
    }
    /** Returns `true` if filter is active on the column. */
    isFilterActive() {
        return this.filterActive;
    }
    // additionalEventAttributes is used by provided simple floating filter, so it can add 'floatingFilter=true' to the event
    setFilterActive(active, source = "api", additionalEventAttributes) {
        if (this.filterActive !== active) {
            this.filterActive = active;
            this.eventService.dispatchEvent(this.createColumnEvent('filterActiveChanged', source));
        }
        const filterChangedEvent = this.createColumnEvent('filterChanged', source);
        if (additionalEventAttributes) {
            object_1.mergeDeep(filterChangedEvent, additionalEventAttributes);
        }
        this.eventService.dispatchEvent(filterChangedEvent);
    }
    /** Returns `true` when this `Column` is hovered, otherwise `false` */
    isHovered() {
        return this.columnHoverService.isHovered(this);
    }
    setPinned(pinned) {
        if (pinned === true || pinned === 'left') {
            this.pinned = 'left';
        }
        else if (pinned === 'right') {
            this.pinned = 'right';
        }
        else {
            this.pinned = null;
        }
        this.dispatchStateUpdatedEvent('pinned');
    }
    setFirstRightPinned(firstRightPinned, source = "api") {
        if (this.firstRightPinned !== firstRightPinned) {
            this.firstRightPinned = firstRightPinned;
            this.eventService.dispatchEvent(this.createColumnEvent('firstRightPinnedChanged', source));
        }
    }
    setLastLeftPinned(lastLeftPinned, source = "api") {
        if (this.lastLeftPinned !== lastLeftPinned) {
            this.lastLeftPinned = lastLeftPinned;
            this.eventService.dispatchEvent(this.createColumnEvent('lastLeftPinnedChanged', source));
        }
    }
    isFirstRightPinned() {
        return this.firstRightPinned;
    }
    isLastLeftPinned() {
        return this.lastLeftPinned;
    }
    isPinned() {
        return this.pinned === 'left' || this.pinned === 'right';
    }
    isPinnedLeft() {
        return this.pinned === 'left';
    }
    isPinnedRight() {
        return this.pinned === 'right';
    }
    getPinned() {
        return this.pinned;
    }
    setVisible(visible, source = "api") {
        const newValue = visible === true;
        if (this.visible !== newValue) {
            this.visible = newValue;
            this.eventService.dispatchEvent(this.createColumnEvent('visibleChanged', source));
        }
        this.dispatchStateUpdatedEvent('hide');
    }
    isVisible() {
        return this.visible;
    }
    isSpanHeaderHeight() {
        const colDef = this.getColDef();
        return !colDef.suppressSpanHeaderHeight && !colDef.autoHeaderHeight;
    }
    /** Returns the column definition for this column.
     * The column definition will be the result of merging the application provided column definition with any provided defaults
     * (e.g. `defaultColDef` grid option, or column types.
     *
     * Equivalent: `getDefinition` */
    getColDef() {
        return this.colDef;
    }
    getColumnGroupShow() {
        return this.colDef.columnGroupShow;
    }
    /**
     * Returns the unique ID for the column.
     *
     * Equivalent: `getId`, `getUniqueId` */
    getColId() {
        return this.colId;
    }
    /**
     * Returns the unique ID for the column.
     *
     * Equivalent: `getColId`, `getUniqueId` */
    getId() {
        return this.colId;
    }
    /**
     * Returns the unique ID for the column.
     *
     * Equivalent: `getColId`, `getId` */
    getUniqueId() {
        return this.colId;
    }
    getDefinition() {
        return this.colDef;
    }
    /** Returns the current width of the column. If the column is resized, the actual width is the new size. */
    getActualWidth() {
        return this.actualWidth;
    }
    getAutoHeaderHeight() {
        return this.autoHeaderHeight;
    }
    /** Returns true if the header height has changed */
    setAutoHeaderHeight(height) {
        const changed = height !== this.autoHeaderHeight;
        this.autoHeaderHeight = height;
        return changed;
    }
    createBaseColDefParams(rowNode) {
        const params = {
            node: rowNode,
            data: rowNode.data,
            colDef: this.colDef,
            column: this,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            context: this.gridOptionsService.context
        };
        return params;
    }
    getColSpan(rowNode) {
        if (generic_1.missing(this.colDef.colSpan)) {
            return 1;
        }
        const params = this.createBaseColDefParams(rowNode);
        const colSpan = this.colDef.colSpan(params);
        // colSpan must be number equal to or greater than 1
        return Math.max(colSpan, 1);
    }
    getRowSpan(rowNode) {
        if (generic_1.missing(this.colDef.rowSpan)) {
            return 1;
        }
        const params = this.createBaseColDefParams(rowNode);
        const rowSpan = this.colDef.rowSpan(params);
        // rowSpan must be number equal to or greater than 1
        return Math.max(rowSpan, 1);
    }
    setActualWidth(actualWidth, source = "api", silent = false) {
        if (this.minWidth != null) {
            actualWidth = Math.max(actualWidth, this.minWidth);
        }
        if (this.maxWidth != null) {
            actualWidth = Math.min(actualWidth, this.maxWidth);
        }
        if (this.actualWidth !== actualWidth) {
            // disable flex for this column if it was manually resized.
            this.actualWidth = actualWidth;
            if (this.flex && source !== 'flex' && source !== 'gridInitializing') {
                this.flex = null;
            }
            if (!silent) {
                this.fireColumnWidthChangedEvent(source);
            }
        }
        this.dispatchStateUpdatedEvent('width');
    }
    fireColumnWidthChangedEvent(source) {
        this.eventService.dispatchEvent(this.createColumnEvent('widthChanged', source));
    }
    isGreaterThanMax(width) {
        if (this.maxWidth != null) {
            return width > this.maxWidth;
        }
        return false;
    }
    getMinWidth() {
        return this.minWidth;
    }
    getMaxWidth() {
        return this.maxWidth;
    }
    getFlex() {
        return this.flex || 0;
    }
    // this method should only be used by the columnModel to
    // change flex when required by the applyColumnState method.
    setFlex(flex) {
        if (this.flex !== flex) {
            this.flex = flex;
        }
        this.dispatchStateUpdatedEvent('flex');
    }
    setMinimum(source = "api") {
        if (generic_1.exists(this.minWidth)) {
            this.setActualWidth(this.minWidth, source);
        }
    }
    setRowGroupActive(rowGroup, source = "api") {
        if (this.rowGroupActive !== rowGroup) {
            this.rowGroupActive = rowGroup;
            this.eventService.dispatchEvent(this.createColumnEvent('columnRowGroupChanged', source));
        }
        this.dispatchStateUpdatedEvent('rowGroup');
    }
    /** Returns `true` if row group is currently active for this column. */
    isRowGroupActive() {
        return this.rowGroupActive;
    }
    setPivotActive(pivot, source = "api") {
        if (this.pivotActive !== pivot) {
            this.pivotActive = pivot;
            this.eventService.dispatchEvent(this.createColumnEvent('columnPivotChanged', source));
        }
        this.dispatchStateUpdatedEvent('pivot');
    }
    /** Returns `true` if pivot is currently active for this column. */
    isPivotActive() {
        return this.pivotActive;
    }
    isAnyFunctionActive() {
        return this.isPivotActive() || this.isRowGroupActive() || this.isValueActive();
    }
    isAnyFunctionAllowed() {
        return this.isAllowPivot() || this.isAllowRowGroup() || this.isAllowValue();
    }
    setValueActive(value, source = "api") {
        if (this.aggregationActive !== value) {
            this.aggregationActive = value;
            this.eventService.dispatchEvent(this.createColumnEvent('columnValueChanged', source));
        }
    }
    /** Returns `true` if value (aggregation) is currently active for this column. */
    isValueActive() {
        return this.aggregationActive;
    }
    isAllowPivot() {
        return this.colDef.enablePivot === true;
    }
    isAllowValue() {
        return this.colDef.enableValue === true;
    }
    isAllowRowGroup() {
        return this.colDef.enableRowGroup === true;
    }
    getMenuTabs(defaultValues) {
        let menuTabs = this.getColDef().menuTabs;
        if (menuTabs == null) {
            menuTabs = defaultValues;
        }
        return menuTabs;
    }
    dispatchStateUpdatedEvent(key) {
        this.eventService.dispatchEvent({
            type: Column.EVENT_STATE_UPDATED,
            key
        });
    }
}
// + renderedHeaderCell - for making header cell transparent when moving
Column.EVENT_MOVING_CHANGED = 'movingChanged';
// + renderedCell - changing left position
Column.EVENT_LEFT_CHANGED = 'leftChanged';
// + renderedCell - changing width
Column.EVENT_WIDTH_CHANGED = 'widthChanged';
// + renderedCell - for changing pinned classes
Column.EVENT_LAST_LEFT_PINNED_CHANGED = 'lastLeftPinnedChanged';
Column.EVENT_FIRST_RIGHT_PINNED_CHANGED = 'firstRightPinnedChanged';
// + renderedColumn - for changing visibility icon
Column.EVENT_VISIBLE_CHANGED = 'visibleChanged';
// + every time the filter changes, used in the floating filters
Column.EVENT_FILTER_CHANGED = 'filterChanged';
// + renderedHeaderCell - marks the header with filter icon
Column.EVENT_FILTER_ACTIVE_CHANGED = 'filterActiveChanged';
// + renderedHeaderCell - marks the header with sort icon
Column.EVENT_SORT_CHANGED = 'sortChanged';
// + renderedHeaderCell - marks the header with sort icon
Column.EVENT_COL_DEF_CHANGED = 'colDefChanged';
Column.EVENT_MENU_VISIBLE_CHANGED = 'menuVisibleChanged';
// + toolpanel, for gui updates
Column.EVENT_ROW_GROUP_CHANGED = 'columnRowGroupChanged';
// + toolpanel, for gui updates
Column.EVENT_PIVOT_CHANGED = 'columnPivotChanged';
// + toolpanel, for gui updates
Column.EVENT_VALUE_CHANGED = 'columnValueChanged';
// + dataTypeService - when waiting to infer cell data types
Column.EVENT_STATE_UPDATED = 'columnStateUpdated';
__decorate([
    context_1.Autowired('gridOptionsService')
], Column.prototype, "gridOptionsService", void 0);
__decorate([
    context_1.Autowired('columnUtils')
], Column.prototype, "columnUtils", void 0);
__decorate([
    context_1.Autowired('columnHoverService')
], Column.prototype, "columnHoverService", void 0);
__decorate([
    context_1.PostConstruct
], Column.prototype, "initialise", null);
exports.Column = Column;
