// ag-grid-react v30.1.0
import { VanillaFrameworkOverrides } from "ag-grid-community";
export declare class ReactFrameworkOverrides extends VanillaFrameworkOverrides {
    private readonly reactUi;
    constructor(reactUi: boolean);
    private frameworkComponents;
    frameworkComponent(name: string): any;
    isFrameworkComponent(comp: any): boolean;
}
