"use strict";

import {
  IDatasource,
  IGetRowsParams,
  ModuleRegistry,
  GetRowIdParams,
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

const ROW_COUNT = 2516;

// Build new data source which uses Express API to get incremental rows from sqlite db
const dataSource: IDatasource = {
  rowCount: ROW_COUNT,
  getRows: getRows,
};

// Define driver function for getting rows from database.
// Should implement server API calls here, with sorting/filtering defined on the server.
function getRows(params: IGetRowsParams) {
  console.log("asking for " + params.startRow + " to " + params.endRow);
  console.log("Filter stuff: " + JSON.stringify(params.filterModel));

  // TODO: Add filtering to request and implement on express server.
  fetch(
    "/api/getRows?" +
      new URLSearchParams({
        startRow: params.startRow.toString(),
        endRow: params.endRow.toString(),
        sortModel: JSON.stringify(params.sortModel),
      }),
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Got " + data.length + " rows");
      const lastRow =
        data.length < params.endRow - params.startRow
          ? params.startRow + data.length
          : ROW_COUNT;
      params.successCallback(data, lastRow);
    })
    .catch((e) => {
      console.error(e);
      params.failCallback();
    });
}

const money: ValueFormatterFunc = (p: ValueFormatterParams) => {
  // Format numbers as USD
  if (typeof p.value === "number") {
    return p.value.toLocaleString("en", {
      style: "currency",
      currency: "USD",
    });
  } else {
    return "";
  }
};

const initialColDefs = [
  { field: "Date" },
  { field: "Close/Last", valueFormatter: money },
  {
    field: "Volume",
    valueFormatter: (p) => (p.value ? p.value.toLocaleString("en") : ""),
  },
  { field: "Open", valueFormatter: money },
  {
    field: "High",
    valueFormatter: money,
    // filter: "agNumberColumnFilter",
    filterParams: { buttons: ["clear", "apply"] },
  },
  { field: "Low", valueFormatter: money },
];

// Main application is defined here.
function App() {
  // Define and configure table columns
  const [colDefs, _setColDefs]: any[] = useState(initialColDefs);

  // Build react page with ag grid
  return (
    <>
      <div>
        <h1>AAPL - Historical</h1>
      </div>
      <div className="card">
        <div className="ag-theme-quartz">
          <AgGridReact
            defaultColDef={{ flex: 1 }}
            columnDefs={colDefs}
            rowModelType={"infinite"}
            datasource={dataSource}
            cacheBlockSize={200}
            getRowId={(d: GetRowIdParams) => String(d.data.id)}
            pagination={true}
            paginationAutoPageSize={true}
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
