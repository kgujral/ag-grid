// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IComponent } from "../../interfaces/iComponent";
import { AgGridCommon } from "../../interfaces/iCommon";
import { Component } from "../../widgets/component";
export interface ILoadingOverlayParams<TData = any, TContext = any> extends AgGridCommon<TData, TContext> {
}
export interface ILoadingOverlayComp extends IComponent<ILoadingOverlayParams> {
}
export declare class LoadingOverlayComponent extends Component implements ILoadingOverlayComp {
    private static DEFAULT_LOADING_OVERLAY_TEMPLATE;
    constructor();
    destroy(): void;
    init(params: ILoadingOverlayParams): void;
}
