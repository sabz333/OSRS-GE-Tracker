import * as db from "../db/index.js"
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// pulls users specific tickers
export default async function deleteUserTickers(watchItem, userID) {
  try {
    const response = await db.query(queries.deleteUserTicker, [watchItem, userID]);
    return response.rows[0];
  } catch (error) {
    throw new DatabaseError("Could not delete user ticker", {
      cause: error,
    });
  }
}