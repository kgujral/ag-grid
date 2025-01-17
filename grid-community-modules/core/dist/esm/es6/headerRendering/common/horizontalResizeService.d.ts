// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../../context/beanStub";
export interface HorizontalResizeParams {
    eResizeBar: HTMLElement;
    dragStartPixels?: number;
    onResizeStart: (shiftKey: boolean) => void;
    onResizing: (delta: number) => void;
    onResizeEnd: (delta: number) => void;
}
export declare class HorizontalResizeService extends BeanStub {
    private dragService;
    private ctrlsService;
    private dragStartX;
    private resizeAmount;
    addResizeBar(params: HorizontalResizeParams): () => void;
    private onDragStart;
    private setResizeIcons;
    private onDragStop;
    private resetIcons;
    private onDragging;
}
