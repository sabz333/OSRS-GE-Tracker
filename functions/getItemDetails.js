import * as db from "../db/index.js";
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// pulls item details from postgres db
export default async function getItemDetails(itemNumber) {
  try {
    const response = await db.query(queries.getItemDetails, [itemNumber]);
    return response.rows[0];
  } catch (error) {
    throw new DatabaseError("Could not retrieve item details from database", {
      cause: error,
    });
  }
}