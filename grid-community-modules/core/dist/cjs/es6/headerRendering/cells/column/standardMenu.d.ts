// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../../../context/beanStub";
import { IMenuFactory } from '../../../interfaces/iMenuFactory';
import { Column } from '../../../entities/column';
import { ContainerType } from '../../../interfaces/iAfterGuiAttachedParams';
export declare class StandardMenuFactory extends BeanStub implements IMenuFactory {
    private filterManager;
    private popupService;
    private focusService;
    private ctrlsService;
    private hidePopup;
    private tabListener;
    hideActiveMenu(): void;
    showMenuAfterMouseEvent(column: Column, mouseEvent: MouseEvent | Touch): void;
    showMenuAfterButtonClick(column: Column, eventSource: HTMLElement, containerType: ContainerType): void;
    private showPopup;
    private trapFocusWithin;
    isMenuEnabled(column: Column): boolean;
}
