import Router from "express-promise-router";
import getTop5Tickers from "../functions/getTop5Tickers.js";
import createHeaderCard from "../functions/createHeaderCard.js";
import getUserTickers from "../functions/getUserTickers.js";
import passport from "passport";

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
    const test = await getUserTickers(1);

    console.log(test);
    console.log(typeof(test.item_ids[2]));

    res.render("dashboard.ejs", {
      mainStyleSheet: mainStyleSheet,
      catId: categoryID,
      headerCardArray: renderedCards,
      dashboardBoolean: dashboardEnable,
    });
  } else {
    res.redirect("/login");
  }
});

export default router;
