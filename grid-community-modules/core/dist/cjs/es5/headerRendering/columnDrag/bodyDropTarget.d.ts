// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { DraggingEvent, DragSourceType, DropTarget } from "../../dragAndDrop/dragAndDropService";
import { BeanStub } from "../../context/beanStub";
import { ColumnPinnedType } from "../../entities/column";
export interface DropListener {
    getIconName(): string | null;
    onDragEnter(params: DraggingEvent): void;
    onDragLeave(params: DraggingEvent): void;
    onDragging(params: DraggingEvent): void;
    onDragStop(params: DraggingEvent): void;
}
export declare class BodyDropTarget extends BeanStub implements DropTarget {
    private dragAndDropService;
    private columnModel;
    private ctrlsService;
    private pinned;
    private eContainer;
    private eSecondaryContainers;
    private currentDropListener;
    private moveColumnFeature;
    private bodyDropPivotTarget;
    constructor(pinned: ColumnPinnedType, eContainer: HTMLElement);
    private postConstruct;
    isInterestedIn(type: DragSourceType): boolean;
    getSecondaryContainers(): HTMLElement[][];
    getContainer(): HTMLElement;
    private init;
    getIconName(): string | null;
    private isDropColumnInPivotMode;
    onDragEnter(draggingEvent: DraggingEvent): void;
    onDragLeave(params: DraggingEvent): void;
    onDragging(params: DraggingEvent): void;
    onDragStop(params: DraggingEvent): void;
}
