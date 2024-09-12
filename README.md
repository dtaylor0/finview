# FinView - AG Grid + SQL Infinite Rows

This is a simple test project to get AG Grid to render infinite rows with
SQLite3 as a database.

## Dependencies

- sqlite3
- node

## Run

The example uses both the Vite dev server and an express node server. The
static files are served from the Vite server, and the express server uses
the sqlite3 package to query and return the specified rows. AG Grid uses this
endpoint under the hood to incrementally fetch 50 rows on each scroll.

Data has been preloaded into the example.db sqlite file from the csv in the
data directory.

```bash
# run in one terminal/session
npm install
npm run dev
```

```bash
# run in a second terminal/session
cd server
node app.js
```
