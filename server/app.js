import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

// Open database sqlite3 connection on server startup
const db = await open({
  filename: path.join(__dirname, "..", "example.db"),
  driver: sqlite3.Database,
});

// Provide API route to select startRow to endRow rows
app.get("/api/getData", (req, res) => {
  const start = req.query.startRow;
  const end = req.query.endRow;
  db.all(`select * from aapl_hist_2 limit ${start}, ${end}`).then((data) =>
    res.send(data),
  );
});

// Listen on 3000
app.listen(port, () => {
  console.log("Express listening on port " + port);
});
