import * as db from "../db/index.js"
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// pulls users specific tickers
export default async function setUserTickers(itemID, itemValue, userId, itemQty) {
  try {
    const response = await db.query(queries.pushUserTicker, [itemID, itemValue, userId, itemQty]);
    return response.rows[0];
  } catch (error) {
    throw new DatabaseError("Could not set user ticker", {
      cause: error,
    });
  }
}