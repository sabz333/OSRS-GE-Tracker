import Router from "express-promise-router";
import {
  getTop5Tickers,
  createHeaderCard,
} from "./util/functions.js"

const router = new Router();

// router to load top 5 items trading in selected category in header bar

router.get("/", async (req, res) => {
  const categoryID = req.query.id;
  const headerItems = await getTop5Tickers(categoryID);
  const renderedCards = headerItems.map((item) => {
    return createHeaderCard(item);
  });

  res.send(renderedCards);
})

export default router;