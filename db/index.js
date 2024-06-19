import "dotenv/config";
import pg from "pg";

// pg.defaults.poolSize = 2;

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({connectionString,});

export const query = (text, params, callback) => {
  return pool.query(text, params, callback);;
}