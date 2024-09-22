import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { SortModelItem } from "@ag-grid-community/core";

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

// Open database sqlite3 connection on server startup
const db = await open({
  filename: path.join(__dirname, "..", "..", "example.db"),
  driver: sqlite3.Database,
});

interface QueryParamsGetRows {
  startRow: number;
  endRow: number;
  sortModel: string;
}

// Provide API route to select startRow to endRow rows
app.get(
  "/api/getRows",
  (req: Request<never, never, never, QueryParamsGetRows>, res: Response) => {
    const start = req.query.startRow;
    const end = req.query.endRow;
    let sortModel;
    if (req.query.sortModel) {
      sortModel = JSON.parse(
        decodeURIComponent(req.query.sortModel),
      ) as SortModelItem[];
    }

    let query = "select * from aapl";
    if (sortModel && sortModel.length > 0) {
      query += ` order by "${sortModel[0].colId}" ${sortModel[0].sort}`;
    }

    query += ` limit ${start}, ${end - start};`;
    // `select * from aapl limit ${start}, ${end - start};`
    console.log(query);
    db.all(query)
      .then((data) => {
        res.send(data);
      })
      .catch((e) => console.error(e));
  },
);

// Listen on 3000
ViteExpress.listen(app, port, () =>
  console.log("Express listening on port " + port),
);
