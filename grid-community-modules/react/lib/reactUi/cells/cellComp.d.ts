// @ag-grid-community/react v30.1.0
import { CellCtrl, UserCompDetails } from '@ag-grid-community/core';
import React from 'react';
export declare enum CellCompState {
    ShowValue = 0,
    EditValue = 1
}
export interface RenderDetails {
    compDetails: UserCompDetails | undefined;
    value?: any;
    force?: boolean;
}
export interface EditDetails {
    compDetails: UserCompDetails;
    popup?: boolean;
    popupPosition?: 'over' | 'under';
}
declare const _default: React.MemoExoticComponent<(props: {
    cellCtrl: CellCtrl;
    printLayout: boolean;
    editingRow: boolean;
}) => JSX.Element>;
export default _default;
