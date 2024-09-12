import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const app = express();
const port = 3000;
const db = await open({
  filename: "../example.db",
  driver: sqlite3.Database,
});

// app.use(express.static(path.join(__dirname, "../dist")));

app.get("/api/getData", (req, res) => {
  const start = req.query.startRow;
  const end = req.query.endRow;
  db.all(`select * from aapl_hist_2 limit ${start}, ${end}`).then((data) =>
    res.send(data),
  );
});

app.listen(port, () => {
  console.log("Express listening on port " + port);
});
