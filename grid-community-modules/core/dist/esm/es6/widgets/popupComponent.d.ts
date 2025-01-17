// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Component } from "./component";
import { IPopupComponent } from "../interfaces/iPopupComponent";
export declare class PopupComponent extends Component implements IPopupComponent<any> {
    isPopup(): boolean;
    setParentComponent(container: Component): void;
    destroy(): void;
}
