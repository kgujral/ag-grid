// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from '../context/beanStub';
import { ColDef } from '../entities/colDef';
import { BaseCellDataType, CoreDataTypeDefinition, DataTypeDefinition } from '../entities/dataType';
import { Column } from '../entities/column';
export declare class DataTypeService extends BeanStub {
    private rowModel;
    private columnModel;
    private columnUtils;
    private valueService;
    private valueFormatterService;
    private dataTypeDefinitions;
    private dataTypeMatchers;
    private isWaitingForRowData;
    private hasObjectValueParser;
    private hasObjectValueFormatter;
    private groupHideOpenParents;
    private initialData;
    private isColumnTypeOverrideInDataTypeDefinitions;
    private columnStateUpdatesPendingInference;
    private columnStateUpdateListenerDestroyFuncs;
    init(): void;
    private processDataTypeDefinitions;
    private mergeDataTypeDefinitions;
    private processDataTypeDefinition;
    private validateDataTypeDefinition;
    private createGroupSafeValueFormatter;
    private updateColDefAndGetDataTypeDefinitionColumnType;
    updateColDefAndGetColumnType(colDef: ColDef, userColDef: ColDef, colId: string): string[] | undefined;
    addColumnListeners(column: Column): void;
    private canInferCellDataType;
    private doColDefPropsPreventInference;
    private doesColDefPropPreventInference;
    private inferCellDataType;
    private getInitialData;
    private initWaitForRowData;
    isPendingInference(): boolean;
    private processColumnsPendingInference;
    private getUpdatedColumnState;
    private checkObjectValueHandlers;
    convertColumnTypes(type: string | string[]): string[];
    private getDateStringTypeDefinition;
    getDateParserFunction(): (value: string | undefined) => Date | undefined;
    getDateFormatterFunction(): (value: Date | undefined) => string | undefined;
    getDataTypeDefinition(column: Column): DataTypeDefinition | CoreDataTypeDefinition | undefined;
    getBaseDataType(column: Column): BaseCellDataType | undefined;
    checkType(column: Column, value: any): boolean;
    validateColDef(colDef: ColDef): void;
    private setColDefPropertiesForBaseDataType;
    private getDefaultDataTypes;
}
