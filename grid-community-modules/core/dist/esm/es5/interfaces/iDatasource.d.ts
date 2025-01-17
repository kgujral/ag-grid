// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { SortModelItem } from "../sortController";
/** Datasource used by both PaginationController and InfiniteRowModel */
export interface IDatasource {
    /** If you know up front how many rows are in the dataset, set it here. Otherwise leave blank. */
    rowCount?: number;
    /** Callback the grid calls that you implement to fetch rows from the server. */
    getRows(params: IGetRowsParams): void;
    /** Optional destroy method, if your datasource has state it needs to clean up. */
    destroy?(): void;
}
/** Params for the above IDatasource.getRows() */
export interface IGetRowsParams {
    /** The first row index to get. */
    startRow: number;
    /** The first row index to NOT get. */
    endRow: number;
    /** Callback to call for the result when successful. */
    successCallback(rowsThisBlock: any[], lastRow?: number): void;
    /** Callback to call when the request fails. */
    failCallback(): void;
    /** If doing server side sorting, contains the sort model */
    sortModel: SortModelItem[];
    /** If doing server side filtering, contains the filter model */
    filterModel: any;
    /** The context as provided on `gridOptions.context` */
    context: any;
}
