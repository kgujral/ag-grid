// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Component } from '../../../widgets/component';
import { IDateComp, IDateParams } from '../../../rendering/dateComponent';
import { IAfterGuiAttachedParams } from '../../../interfaces/iAfterGuiAttachedParams';
export declare class DefaultDateComponent extends Component implements IDateComp {
    private readonly eDateInput;
    constructor();
    private params;
    private usingSafariDatePicker;
    destroy(): void;
    init(params: IDateParams): void;
    private setParams;
    onParamsUpdated(params: IDateParams): void;
    getDate(): Date | null;
    setDate(date: Date): void;
    setInputPlaceholder(placeholder: string): void;
    setDisabled(disabled: boolean): void;
    afterGuiAttached(params?: IAfterGuiAttachedParams): void;
    private shouldUseBrowserDatePicker;
}
