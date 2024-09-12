"use strict";

import {
  IDatasource,
  IGetRowsParams,
  ModuleRegistry,
  // GetRowIdFunc,
  GetRowIdParams,
  // SortModelItem,
  ValueFormatterFunc,
  ValueFormatterParams,
} from "@ag-grid-community/core";
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { useState } from "react";
import "./App.css";

// Any Module functionalities need to be registered here to work.
ModuleRegistry.registerModules([InfiniteRowModelModule]);

// Define sorting and filtering functions.
/* const sortAndFilter = (
  allOfTheData: any[],
  sortModel: any,
  filterModel: any,
) => {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
};

const sortData = (sortModel: any, data: any[]) => {
  const sortPresent = sortModel && sortModel.length > 0;
  if (!sortPresent) {
    return data;
  }
  return data;
};

const filterData = (filterModel: any, data: any[]) => {
  const filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  return data;
}; */

const dataSource: IDatasource = {
  rowCount: undefined,
  getRows: (params: IGetRowsParams) => {
    console.log("asking for " + params.startRow + " to " + params.endRow);
    fetch(`/api/getData?startRow=${params.startRow}&endRow=${params.endRow}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Got " + data.length + " rows");
        params.successCallback(data, -1);
      });
  },
};

// Main application is defined here.
function App() {
  const money: ValueFormatterFunc = (p: ValueFormatterParams) => {
    if (typeof p.value === "number") {
      return p.value.toLocaleString("en", {
        style: "currency",
        currency: "USD",
      });
    } else {
      console.log("Expected number, got " + typeof p.value + " : " + p.value);
      return "";
    }
  };
  const [colDefs, _setColDefs]: any[] = useState([
    { field: "Date", flex: 1 },
    { field: "Close/Last", valueFormatter: money, flex: 1 },
    { field: "Volume", flex: 1 },
    { field: "Open", valueFormatter: money, flex: 1 },
    {
      field: "High",
      valueFormatter: money,
      flex: 1,
      filter: "agNumberColumnFilter",
      filterParams: { buttons: ["clear", "apply"] },
    },
    { field: "Low", valueFormatter: money, flex: 1 },
  ]);

  return (
    <>
      <div>
        <h1>AAPL - Historical</h1>
      </div>
      <div className="card">
        <div className="ag-theme-quartz" style={{ height: 500 }}>
          <AgGridReact
            columnDefs={colDefs}
            rowModelType={"infinite"}
            datasource={dataSource}
            cacheBlockSize={50}
            getRowId={(d: GetRowIdParams) => d.data.id}
          />
        </div>
      </div>
    </>
  );
}

export default App;
