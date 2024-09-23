import Router from "express-promise-router";
import searchItemDatabase from "../functions/searchItemDatabase.js";
import createSearchResult from "../functions/createSearchResult.js";

const router = new Router();

// router to handle search queries from search bar

router.get("/", async (req, res) => {
  const searchString = req.query.search;
  const searchedItems = await searchItemDatabase(searchString);
  const searchResults = searchedItems.map(item => createSearchResult(item));
  res.send(searchResults);
})

export default router;