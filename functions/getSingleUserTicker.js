import * as db from "../db/index.js"
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// pulls users specific tickers
export default async function getSingleUserTicker(itemTickerNumber, userID) {
  try {
    const response = await db.query(queries.getSingleTicker, [userID, itemTickerNumber]);
    return response.rows[0];
  } catch (error) {
    throw new DatabaseError("Could not find user ticker", {
      cause: error,
    });
  }
}