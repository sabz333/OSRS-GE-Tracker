import * as db from "../db/index.js"
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// pulls users specific tickers
export default async function getUserTickers(userId) {
  try {
    const response = await db.query(queries.getUserTickers, [userId]);
    return response.rows[0];
  } catch (error) {
    throw new DatabaseError("Could not query user tickers", {
      cause: error,
    });
  }
}