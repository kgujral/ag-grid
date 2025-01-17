import { Component } from "@ag-grid-community/core";
import { FormatPanelOptions } from "../formatPanel";
export declare class SeriesPanel extends Component {
    static TEMPLATE: string;
    private seriesGroup;
    private chartTranslationService;
    private readonly chartController;
    private readonly chartOptionsService;
    private readonly isExpandedOnInit;
    private seriesSelectOptions;
    private activePanels;
    private seriesType;
    private widgetFuncs;
    private seriesWidgetMappings;
    constructor({ chartController, chartOptionsService, seriesType, isExpandedOnInit }: FormatPanelOptions);
    private init;
    private refreshWidgets;
    private initSeriesSelect;
    private initTooltips;
    private initStrokeWidth;
    private initLineWidth;
    private initLineDash;
    private initLineOpacity;
    private initFillOpacity;
    private initLabels;
    private getSectorLabelPositionRatio;
    private initShadow;
    private initMarkers;
    private initBins;
    private addWidget;
    private getSeriesOption;
    private setSeriesOption;
    private getChartSeriesType;
    private getSeriesSelectOptions;
    private updateSeriesType;
    private translate;
    private destroyActivePanels;
    protected destroy(): void;
}
