// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IFilterOptionDef } from '../../interfaces/iFilter';
import { ScalarFilterParams } from './scalarFilter';
export declare class OptionsFactory {
    protected customFilterOptions: {
        [name: string]: IFilterOptionDef;
    };
    protected filterOptions: (IFilterOptionDef | string)[];
    protected defaultOption: string;
    init(params: ScalarFilterParams, defaultOptions: string[]): void;
    getFilterOptions(): (IFilterOptionDef | string)[];
    private mapCustomOptions;
    private selectDefaultItem;
    getDefaultOption(): string;
    getCustomOption(name?: string | null): IFilterOptionDef | undefined;
}
