import { ICellEditor, PopupComponent, RichCellEditorParams } from "@ag-grid-community/core";
export declare class RichSelectCellEditor<TData = any, TValue = any> extends PopupComponent implements ICellEditor<TValue> {
    private params;
    private focusAfterAttached;
    private richSelect;
    constructor();
    init(params: RichCellEditorParams<TData, TValue>): void;
    private onEditorPickerValueSelected;
    private onEditorFocusOut;
    private buildRichSelectParams;
    afterGuiAttached(): void;
    getValue(): any;
    isPopup(): boolean;
}
