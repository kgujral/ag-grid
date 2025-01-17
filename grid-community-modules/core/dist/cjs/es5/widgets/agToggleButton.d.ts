// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgCheckbox } from './agCheckbox';
import { IInputField } from './agAbstractInputField';
export declare class AgToggleButton extends AgCheckbox {
    constructor(config?: IInputField);
    setValue(value: boolean, silent?: boolean): this;
}
