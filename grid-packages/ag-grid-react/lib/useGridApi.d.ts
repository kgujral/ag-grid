// ag-grid-react v30.1.0
import { RefObject } from 'react';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AgGridReact } from './agGridReact';
declare const useGridApis: <T extends AgGridReact<any>>(gridRef: RefObject<T>) => [GridApi | null, ColumnApi | null];
export default useGridApis;
