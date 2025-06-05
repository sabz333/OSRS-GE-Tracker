import Router from "express-promise-router";
import getNewsArticles from "../functions/getNewsArticles.js"
import getTop5Tickers from "../functions/getTop5Tickers.js";
import createHeaderCard from "../functions/createHeaderCard.js";
import createDefaultListItem from "../functions/createDefaultListItem.js";
import topItemsList from "../functions/topItemsList.js";
import { months } from "./util/constantVariables.js";

// router for rendering and sending home page

const router = new Router();
const mainStyleSheet = "styles/main.css";


router.get("/", async (req, res) => {
  try {
    const categoryID = 10;
    const today = new Date();
    const dashboardEnable = req.isAuthenticated();
    const monthYear = months[today.getMonth()] + " " + today.getFullYear();
    const [newsArticles, headerItems, listItems] = await Promise.all([
      getNewsArticles(),
      getTop5Tickers(categoryID),
      topItemsList()
    ]);
  
    res.render("home.ejs", {
      mainStyleSheet: mainStyleSheet,
      monthYearString: monthYear,
      newsArticleArray: newsArticles,
      headerCardArray: headerItems.map(createHeaderCard),
      topItemListArray: renderedListItems.map(createDefaultListItem),
      catId: categoryID,
      dashboardBoolean: dashboardEnable,
    });
  } catch (error) {
      console.error("Error in home route: ", error);
  }
});

export default router;