// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
export declare class AutoScrollService {
    private tickingInterval;
    private scrollHorizontally;
    private scrollVertically;
    private tickLeft;
    private tickRight;
    private tickUp;
    private tickDown;
    private scrollContainer;
    private scrollByTick;
    private getVerticalPosition;
    private setVerticalPosition;
    private getHorizontalPosition;
    private setHorizontalPosition;
    private shouldSkipVerticalScroll;
    private shouldSkipHorizontalScroll;
    private onScrollCallback;
    private tickCount;
    constructor(params: {
        scrollContainer: HTMLElement;
        scrollAxis: 'x' | 'y' | 'xy';
        scrollByTick?: number;
        getVerticalPosition?: () => number;
        setVerticalPosition?: (position: number) => void;
        getHorizontalPosition?: () => number;
        setHorizontalPosition?: (position: number) => void;
        shouldSkipVerticalScroll?: () => boolean;
        shouldSkipHorizontalScroll?: () => boolean;
        onScrollCallback?: () => void;
    });
    check(mouseEvent: MouseEvent, forceSkipVerticalScroll?: boolean): void;
    private ensureTickingStarted;
    private doTick;
    ensureCleared(): void;
}
