import { BeanStub, IDatasource, RowBounds, RowNode, IInfiniteRowModel, RowModelType } from "@ag-grid-community/core";
export declare class InfiniteRowModel extends BeanStub implements IInfiniteRowModel {
    private readonly filterManager;
    private readonly sortController;
    private readonly selectionService;
    private readonly rowRenderer;
    private readonly rowNodeBlockLoader;
    private infiniteCache;
    private datasource;
    private rowHeight;
    private cacheParams;
    getRowBounds(index: number): RowBounds;
    ensureRowHeightsValid(startPixel: number, endPixel: number, startLimitIndex: number, endLimitIndex: number): boolean;
    init(): void;
    private verifyProps;
    start(): void;
    private destroyDatasource;
    private addEventListeners;
    private onFilterChanged;
    private onSortChanged;
    private onColumnEverything;
    private isSortModelDifferent;
    getType(): RowModelType;
    setDatasource(datasource: IDatasource | undefined): void;
    isEmpty(): boolean;
    isRowsToRender(): boolean;
    getNodesInRangeForSelection(firstInRange: RowNode, lastInRange: RowNode): RowNode[];
    private reset;
    private createModelUpdatedEvent;
    private resetCache;
    private defaultIfInvalid;
    private destroyCache;
    private onCacheUpdated;
    getRow(rowIndex: number): RowNode | undefined;
    getRowNode(id: string): RowNode | undefined;
    forEachNode(callback: (rowNode: RowNode, index: number) => void): void;
    getTopLevelRowCount(): number;
    getTopLevelRowDisplayedIndex(topLevelIndex: number): number;
    getRowIndexAtPixel(pixel: number): number;
    getRowCount(): number;
    isRowPresent(rowNode: RowNode): boolean;
    refreshCache(): void;
    purgeCache(): void;
    isLastRowIndexKnown(): boolean;
    setRowCount(rowCount: number, lastRowIndexKnown?: boolean): void;
}
