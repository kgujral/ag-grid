// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../context/beanStub";
import { ITooltipParams } from "../rendering/tooltipComponent";
import { WithoutGridCommon } from "../interfaces/iCommon";
export interface TooltipParentComp {
    getTooltipParams(): WithoutGridCommon<ITooltipParams>;
    getGui(): HTMLElement;
}
export declare class CustomTooltipFeature extends BeanStub {
    private parentComp;
    private tooltipShowDelayOverride?;
    private tooltipHideDelayOverride?;
    private readonly DEFAULT_SHOW_TOOLTIP_DELAY;
    private readonly DEFAULT_HIDE_TOOLTIP_DELAY;
    private readonly SHOW_QUICK_TOOLTIP_DIFF;
    private readonly FADE_OUT_TOOLTIP_TIMEOUT;
    private readonly INTERACTIVE_HIDE_DELAY;
    private static lastTooltipHideTime;
    private static isLocked;
    private popupService;
    private userComponentFactory;
    private tooltipShowDelay;
    private tooltipHideDelay;
    private showTooltipTimeoutId;
    private hideTooltipTimeoutId;
    private interactiveTooltipTimeoutId;
    private interactionEnabled;
    private isInteractingWithTooltip;
    private state;
    private lastMouseEvent;
    private tooltipComp;
    private tooltipPopupDestroyFunc;
    private tooltipInstanceCount;
    private tooltipMouseTrack;
    private tooltipTrigger;
    private tooltipMouseEnterListener;
    private tooltipMouseLeaveListener;
    private tooltipFocusInListener;
    private tooltipFocusOutListener;
    private onBodyScrollEventCallback;
    private onColumnMovedEventCallback;
    constructor(parentComp: TooltipParentComp, tooltipShowDelayOverride?: number | undefined, tooltipHideDelayOverride?: number | undefined);
    private postConstruct;
    private getGridOptionsTooltipDelay;
    private getTooltipDelay;
    protected destroy(): void;
    private getTooltipTrigger;
    onMouseEnter(e: MouseEvent): void;
    private onMouseMove;
    private onMouseDown;
    private onMouseLeave;
    private onFocusIn;
    private onFocusOut;
    private onKeyDown;
    private prepareToShowTooltip;
    private isLastTooltipHiddenRecently;
    private setToDoNothing;
    private showTooltip;
    hideTooltip(forceHide?: boolean): void;
    private newTooltipComponentCallback;
    private onTooltipMouseEnter;
    private onTooltipMouseLeave;
    private onTooltipFocusIn;
    private onTooltipFocusOut;
    private positionTooltip;
    private destroyTooltipComp;
    private clearTooltipListeners;
    private lockService;
    private unlockService;
    private startHideTimeout;
    private clearShowTimeout;
    private clearHideTimeout;
    private clearInteractiveTimeout;
    private clearTimeouts;
}
