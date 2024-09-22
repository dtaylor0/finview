# FinView - AG Grid + SQL Infinite Rows

This is a simple test project to get AG Grid to render infinite rows with
SQLite3 as a database. Added server-side sorting, and will be adding
server-side filtering next.

Data source: [Nasdaq](https://www.nasdaq.com/market-activity/stocks/aapl/historical?page=1&rows_per_page=10&timeline=y10)

## Dependencies

- sqlite3
- node

## Run

The example uses the vite-express package to serve a react frontend with express
backend using Express middleware in Vite. The express server serves the static
files and uses the sqlite3 package in an API route to query and return the
specified rows. AG Grid uses this endpoint under the hood to incrementally fetch
a batch of rows on each scroll. The API endpoint also supports sorting the data
column-wise in ascending or descending order, which allows the frontend to
dynamically request chunked and sorted data. Filtering is not yet implemented.

Data has been preloaded into the example.db sqlite file from the csv in the
data directory.

```bash
npm install
npm run dev
```

Visit the local site on port 3000.
