// Type definitions for @ag-grid-community/core v30.1.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
export interface XmlElement {
    name: string;
    properties?: XmlAttributes;
    children?: XmlElement[];
    textNode?: string | null;
}
export interface HeaderElement {
    [key: string]: string | undefined;
    version?: string;
    standalone?: string;
    encoding?: string;
}
export interface XmlAttributes {
    prefixedAttributes?: PrefixedXmlAttributes[];
    rawMap?: any;
}
export interface PrefixedXmlAttributes {
    prefix: string;
    map: any;
}
