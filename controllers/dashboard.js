import Router from "express-promise-router";
import getTop5Tickers from "../functions/getTop5Tickers.js";
import createHeaderCard from "../functions/createHeaderCard.js";
import getUserTickers from "../functions/getUserTickers.js";
import createDefaultListItem from "../functions/createDefaultListItem.js";

const router = new Router();
const mainStyleSheet = "styles/main.css";

router.get("/", async (req, res) => {
  const categoryID = 10;
  let dashboardEnable = false;
  const headerItems = await getTop5Tickers(categoryID);
  if (req.isAuthenticated()) {
    dashboardEnable = true;
    const userTickers = await getUserTickers(req.user.id);
    const renderedTickerTable = userTickers.map((ticker) => {
      return createDefaultListItem(ticker, ticker.item_value, ticker.item_qty);
    })

    res.render("dashboard.ejs", {
      mainStyleSheet: mainStyleSheet,
      catId: categoryID,
      headerCardArray: headerItems.map(createHeaderCard),
      dashboardBoolean: dashboardEnable,
      userItemListArray: renderedTickerTable,
    });
  } else {
    res.redirect("/login");
  }
});

export default router;
