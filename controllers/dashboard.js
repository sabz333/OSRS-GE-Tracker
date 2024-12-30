import Router from "express-promise-router";
import getTop5Tickers from "../functions/getTop5Tickers.js";
import createHeaderCard from "../functions/createHeaderCard.js";
import getUserTickers from "../functions/getUserTickers.js";
import userTickerList from "../functions/userTickerList.js";
import createDefaultListItem from "../functions/createDefaultListItem.js";

const router = new Router();
const mainStyleSheet = "styles/main.css";

router.get("/", async (req, res) => {
  const categoryID = 10;
  let dashboardEnable = false;
  const headerItems = await getTop5Tickers(categoryID);
  const renderedCards = headerItems.map((item) => {
    return createHeaderCard(item);
  });
  if (req.isAuthenticated()) {
    dashboardEnable = true;
    const userTickers = await getUserTickers(req.user.id);
    const userTickerTable = await userTickerList(userTickers.item_ids);
    const renderedTickerTable = userTickers.item_ids.map((item, idx) => {
      const itemObject = userTickerTable.find((ticker) => ticker.id === item);
      return createDefaultListItem(itemObject, userTickers.item_costs[idx], userTickers.item_qty[idx]);
    })

    console.log(userTickers);

    res.render("dashboard.ejs", {
      mainStyleSheet: mainStyleSheet,
      catId: categoryID,
      headerCardArray: renderedCards,
      dashboardBoolean: dashboardEnable,
      userItemListArray: renderedTickerTable,
    });
  } else {
    res.redirect("/login");
  }
});

export default router;
