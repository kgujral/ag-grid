// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgEvent, ColumnEvent } from "./events";
import { Column } from "./entities/column";
import { BeanStub } from "./context/beanStub";
export declare class AlignedGridsService extends BeanStub {
    private columnModel;
    private ctrlsService;
    private logger;
    private consuming;
    private setBeans;
    private init;
    private fireEvent;
    private onEvent;
    private fireColumnEvent;
    private fireScrollEvent;
    private onScrollEvent;
    getMasterColumns(event: ColumnEvent): Column[];
    getColumnIds(event: ColumnEvent): string[];
    onColumnEvent(event: AgEvent): void;
    private processGroupOpenedEvent;
    private processColumnEvent;
}
