// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../context/beanStub";
import { Column } from "../entities/column";
import { ColumnGroup } from "../entities/columnGroup";
import { RowNode } from "../entities/rowNode";
import { Beans } from "../rendering/beans";
import { ITooltipParams, TooltipLocation } from "../rendering/tooltipComponent";
import { ColDef, ColGroupDef } from "../entities/colDef";
import { WithoutGridCommon } from "../interfaces/iCommon";
export interface ITooltipFeatureCtrl {
    getTooltipValue(): any;
    getGui(): HTMLElement;
    getLocation(): TooltipLocation;
    getColumn?(): Column | ColumnGroup;
    getColDef?(): ColDef | ColGroupDef;
    getRowIndex?(): number;
    getRowNode?(): RowNode;
    getValueFormatted?(): string;
}
export declare class TooltipFeature extends BeanStub {
    private readonly ctrl;
    private readonly beans;
    private eGui;
    private tooltip;
    private genericTooltipFeature;
    private browserTooltips;
    constructor(ctrl: ITooltipFeatureCtrl, beans: Beans);
    setComp(eGui: HTMLElement): void;
    private setBrowserTooltip;
    private setupTooltip;
    private updateTooltipText;
    private createTooltipFeatureIfNeeded;
    refreshToolTip(): void;
    getTooltipParams(): WithoutGridCommon<ITooltipParams>;
    private getTooltipText;
    destroy(): void;
}
