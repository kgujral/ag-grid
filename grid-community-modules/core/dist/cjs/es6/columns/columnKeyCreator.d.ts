// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
export declare class ColumnKeyCreator {
    private existingKeys;
    addExistingKeys(keys: string[]): void;
    getUniqueKey(colId?: string | null, colField?: string | null): string;
}
