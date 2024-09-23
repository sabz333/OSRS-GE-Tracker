import * as db from "../db/index.js";
import queries from "../db/queries.js";
import { DatabaseError } from "../errors/Errors.js";

// function to pull top items based on vol from db
export default async function topItemsList() {
  try {
    const response = await db.query(queries.getTopItems);
    return response.rows;
  } catch (error) {
    throw new DatabaseError("Could not fetch Top Items List", { cause: error });
  }
}