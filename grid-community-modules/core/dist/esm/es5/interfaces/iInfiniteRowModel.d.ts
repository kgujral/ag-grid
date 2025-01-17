// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IRowModel } from "./iRowModel";
import { IDatasource } from "./iDatasource";
export interface IInfiniteRowModel extends IRowModel {
    setDatasource(datasource: IDatasource | undefined): void;
    refreshCache(): void;
    purgeCache(): void;
    setRowCount(rowCount: number, maxRowFound?: boolean): void;
}
