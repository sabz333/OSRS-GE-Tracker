import Router from "express-promise-router";
import getUserTickers from "../functions/getUserTickers.js";
import setUserTicker from "../functions/setUserTicker.js";
import getSingleUserTicker from "../functions/getSingleUserTicker.js";
import updateUserTickers from "../functions/updateUserTicker.js";
import deleteUserTickers from "../functions/deleteUserTicker.js";
import createDefaultListItem from "../functions/createDefaultListItem.js";

const router = new Router();

// Check if user is authenticated
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

// router to handle saved user items
router.get("/pull", checkAuthentication, async (req, res) => {
  try {
    const header = `<div class="row">
      <div class="col-11 col-sm-5 col-xl-2 d-none d-sm-block me-5">Your Watched Items</div>
      <div class="col-5 d-sm-none">Item</div>
      <div class="col-1 text-center d-none d-xl-block mx-3">Price</div>
      <div class="col-1 text-end d-none d-xl-block mx-3">Quantity</div>
      <div class="col col-xl-2 text-center ms-0">Day Gain</div>
      <div class="col-2 col-xl-1 text-center text-xl-end">Value</div>
      <div class="col col-xl-3 text-center d-none d-xl-block">Value Change</div>
      <div class="col-1"></div>
    </div>`;
    const userTickers = await getUserTickers(req.user.id);
    const renderedTickerTable = userTickers.map((ticker) => {
      return createDefaultListItem(ticker, ticker.item_value, ticker.item_qty);
    });
    renderedTickerTable.unshift(header);
    res.send(renderedTickerTable);
  } catch (error) {
    console.error("Error in watchTable/pull: ", error);
  }
});

router.post("/push", checkAuthentication, async (req, res) => {
  try {
    await setUserTicker(
      req.body.item,
      req.body.value,
      req.user.id,
      req.body.quantity
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Error in watchTable/push: ", error);
    res.sendStatus(501);
  }
});

router.put("/edit/:ticker", async (req, res) => {
  const { value, quantity } = req.body.data;
  const { ticker } = req.params;
  const userID = req.user.id;
  try {
    await updateUserTickers(ticker, value, quantity, userID);
    const tickerInfo = await getSingleUserTicker(ticker, userID);
    const renderedTickerLine = createDefaultListItem(
      tickerInfo,
      parseInt(value),
      parseInt(quantity)
    );
    res.send(JSON.stringify({ renderedLine: renderedTickerLine }));
  } catch (error) {
    console.error("Error in watchTable/edit: ", error);
    res.sendStatus(501);
  }
});

router.delete("/remove/:ticker", async (req, res) => {
  try {
    await deleteUserTickers(req.params.ticker, req.user.id);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error in watchTable/remove: ", error);
    res.sendStatus(401);
  }
});

export default router;
