import * as db from "../db/index.js"
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// pulls top 5 items with highest volume trade in category for header card generation
export default async function getTop5Tickers(category) {
  try {
    const response = await db.query(queries.getTopTickers, [category]);
    return response.rows;
  } catch (error) {
    throw new DatabaseError("Could not query Top 5 Tickers from database", {
      cause: error,
    });
  }
}