import * as db from "../db/index.js";
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// returns rows of items matching search description
export default async function searchItemDatabase(searchString) {
  try {
    const response = await db.query(queries.itemSearchQuery, [searchString]);
    return response.rows;
  } catch (error) {
    throw new DatabaseError("Search query failed", { cause: error });
  }
}