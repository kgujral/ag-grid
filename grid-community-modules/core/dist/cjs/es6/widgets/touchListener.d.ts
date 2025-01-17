// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { AgEvent } from "../events";
import { IEventEmitter } from "../interfaces/iEventEmitter";
export interface TapEvent extends AgEvent {
    touchStart: Touch;
}
export interface LongTapEvent extends AgEvent {
    touchStart: Touch;
    touchEvent: TouchEvent;
}
export declare class TouchListener implements IEventEmitter {
    static EVENT_TAP: string;
    static EVENT_DOUBLE_TAP: string;
    static EVENT_LONG_TAP: string;
    private static DOUBLE_TAP_MILLIS;
    private eElement;
    private destroyFuncs;
    private moved;
    private touching;
    private touchStart;
    private lastTapTime;
    private eventService;
    private preventMouseClick;
    constructor(eElement: Element, preventMouseClick?: boolean);
    private getActiveTouch;
    addEventListener(eventType: string, listener: Function): void;
    removeEventListener(eventType: string, listener: Function): void;
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
    private checkForDoubleTap;
    destroy(): void;
}
