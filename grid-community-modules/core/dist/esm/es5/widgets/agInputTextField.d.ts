// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgAbstractInputField, IInputField } from './agAbstractInputField';
export interface ITextInputField extends IInputField {
    allowedCharPattern?: string;
}
export declare class AgInputTextField extends AgAbstractInputField<HTMLInputElement, string, ITextInputField> {
    constructor(config?: ITextInputField, className?: string, inputType?: string);
    protected postConstruct(): void;
    setValue(value?: string | null, silent?: boolean): this;
    /** Used to set an initial value into the input without necessarily setting `this.value` or triggering events (e.g. to set an invalid value) */
    setStartValue(value?: string | null): void;
    private preventDisallowedCharacters;
}
