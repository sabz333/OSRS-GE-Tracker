import pg from "pg";

const pool = new pg.Pool({
  user: "sabzc",
  host: "localhost",
  database: "data",
  password: "runescape3",
  port: 5532,
});

export const query = (text, params, callback) => {
  return pool.query(text, params, callback);
}