import * as db from "../db/index.js"
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// pulls users specific tickers
export default async function updateUserTickers(itemTickerNumber, itemValue, itemQty, userId) {
  try {
    const response = await db.query(queries.updateUserTicker, [itemValue, itemQty, itemTickerNumber, userId]);
    return response.rows[0];
  } catch (error) {
    throw new DatabaseError(`Could not update user ticker #${itemTickerNumber}`, {
      cause: error,
    });
  }
}