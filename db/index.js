import "dotenv/config";
import pg from "pg";

// pg.defaults.poolSize = 2;

// const connectionString = process.env.DATABASE_URL;
// const connectionString = "postgresql://admin:runescape@psql-db:5432/OSRS";

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DBNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const query = (text, params, callback) => {
  return pool.query(text, params, callback);;
}