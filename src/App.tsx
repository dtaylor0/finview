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

// TODO: Define sorting and filtering functions.

// const sortModel: SortModelItem[] = [{ colId: "High", sort: "asc" }];

// Build new data source which uses Express API to get incremental rows from sqlite db
const dataSource: IDatasource = {
  rowCount: undefined,
  getRows: (params: IGetRowsParams) => {
    console.log("asking for " + params.startRow + " to " + params.endRow);
    fetch(`/api/getData?startRow=${params.startRow}&endRow=${params.endRow}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Got " + data.length + " rows");
        const lastRow =
          data.length < params.endRow - params.startRow
            ? params.startRow + data.length
            : -1;
        params.successCallback(data, lastRow);
      });
  },
  // sortModel: sortModel,
};

// Main application is defined here.
function App() {
  const money: ValueFormatterFunc = (p: ValueFormatterParams) => {
    // Format numbers as USD
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

  // Define and configure table columns
  const [colDefs, _setColDefs]: any[] = useState([
    { field: "Date", flex: 1 },
    { field: "Close/Last", valueFormatter: money, flex: 1 },
    {
      field: "Volume",
      flex: 1,
      valueFormatter: (p) => (p.value ? p.value.toLocaleString("en") : ""),
    },
    { field: "Open", valueFormatter: money, flex: 1 },
    {
      field: "High",
      valueFormatter: money,
      flex: 1,
      /* filter: "agNumberColumnFilter",
      filterParams: { buttons: ["clear", "apply"] }, */
    },
    { field: "Low", valueFormatter: money, flex: 1 },
  ]);

  // Build react page with ag grid
  return (
    <>
      <div>
        <h1>AAPL - Historical</h1>
      </div>
      <div className="card">
        <div className="ag-theme-quartz" style={{ height: 300 }}>
          <AgGridReact
            columnDefs={colDefs}
            rowModelType={"infinite"}
            datasource={dataSource}
            cacheBlockSize={50}
            getRowId={(d: GetRowIdParams) => String(d.data.id)}
          />
        </div>
      </div>
      <a
        target="_blank"
        href="https://www.nasdaq.com/market-activity/stocks/aapl/historical?page=1&rows_per_page=10&timeline=y10"
      >
        Source
      </a>
    </>
  );
}

export default App;
