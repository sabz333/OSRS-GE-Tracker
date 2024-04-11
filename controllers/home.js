import Router from "express-promise-router";
import {
  months,
  getNewsArticles,
  getTop5Tickers,
  createHeaderCard,
  topItemsList,
  createTopMoverListItem,
} from "./util/functions.js";

// router for rendering and sending home page

const router = new Router();
const newsArticles = await getNewsArticles();
const mainStyleSheet = "styles/main.css";


router.get("/", async (req, res) => {
  const categoryID = 10;
  const today = new Date();
  const monthYear = months[today.getMonth()] + " " + today.getFullYear();
  const headerItems = await getTop5Tickers(categoryID);
  const renderedCards = headerItems.map((item) => {
    return createHeaderCard(item);
  });

  const listItems = await topItemsList();
  const renderedListItems = listItems.map((item) => {
    return createTopMoverListItem(item);
  })

  res.render("home.ejs", {
    mainStyleSheet: mainStyleSheet,
    monthYearString: monthYear,
    newsArticleArray: newsArticles,
    headerCardArray: renderedCards,
    topItemListArray: renderedListItems,
    catId: categoryID,
  });
});

export default router;