// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IHeaderColumn } from "../interfaces/iHeaderColumn";
import { IProvidedColumn } from "../interfaces/iProvidedColumn";
import { ProvidedColumnGroup } from "../entities/providedColumnGroup";
import { Column } from "../entities/column";
import { BeanStub } from "../context/beanStub";
import { ColDef } from "../entities/colDef";
export declare class ColumnUtils extends BeanStub {
    calculateColMinWidth(colDef: ColDef): number;
    calculateColMaxWidth(colDef: ColDef): number;
    calculateColInitialWidth(colDef: ColDef): number;
    getOriginalPathForColumn(column: Column, originalBalancedTree: IProvidedColumn[]): ProvidedColumnGroup[] | null;
    depthFirstOriginalTreeSearch(parent: ProvidedColumnGroup | null, tree: IProvidedColumn[], callback: (treeNode: IProvidedColumn, parent: ProvidedColumnGroup | null) => void): void;
    depthFirstAllColumnTreeSearch(tree: IHeaderColumn[] | null, callback: (treeNode: IHeaderColumn) => void): void;
    depthFirstDisplayedColumnTreeSearch(tree: IHeaderColumn[] | null, callback: (treeNode: IHeaderColumn) => void): void;
}
