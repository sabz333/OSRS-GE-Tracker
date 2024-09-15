import "dotenv/config";
import pg from "pg";
import { secrets } from "docker-secret";

// pg.defaults.poolSize = 2;

// const connectionString = process.env.DATABASE_URL;
// const connectionString = "postgresql://admin:runescape@psql-db:5432/OSRS";

const username = process.env.DB_USER || secrets.POSTGRES_USER;
const host = process.env.DB_HOST || secrets.POSTGRES_HOST;
const database = process.env.DB_DBNAME || secrets.POSTGRES_DB;
const password = process.env.DB_PASSWORD || secrets.POSTGRES_PASSWORD;
const dbPort = process.env.DB_PORT || secrets.POSTGRES_PORT;

const pool = new pg.Pool({
  user: username,
  host: host,
  database: database,
  password: password,
  port: dbPort,
});

export const query = (text, params, callback) => {
  return pool.query(text, params, callback);;
}