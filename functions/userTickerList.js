import * as db from "../db/index.js";
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// function to pull saved user tickers from db
export default async function userTickerList(item_ids) {
  try {
    const response = await db.query(queries.getUserTickerTable, [item_ids]);
    return response.rows;
  } catch (error) {
    throw new DatabaseError("Could not fetch user ticker table", { cause: error });
  }
}