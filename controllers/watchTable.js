import Router from "express-promise-router";
import getUserTickers from "../functions/getUserTickers.js";
import setUserTicker from "../functions/setUserTicker.js";
import deleteUserTickers from "../functions/deleteUserTicker.js";
import createDefaultListItem from "../functions/createDefaultListItem.js";

const router = new Router();

// router to handle saved user items

router.get("/pull", async (req, res) => {
  if (req.isAuthenticated) {
    const header = `<div class="row">
      <div class="col-11 col-sm-5 col-xl-2 d-none d-sm-block me-5">Your Watched Items</div>
      <div class="col-5 d-sm-none">Item</div>
      <div class="col-1 text-center d-none d-xl-block mx-3">Price</div>
      <div class="col-1 text-end d-none d-xl-block mx-3">Quantity</div>
      <div class="col col-xl-2 text-center ms-0">Day Gain</div>
      <div class="col-2 col-xl-1 text-center text-xl-end">Value</div>
      <div class="col col-xl-3 text-center d-none d-xl-block">Value Change</div>
      <div class="col-1"></div>
    </div>`
    const userTickers = await getUserTickers(req.user.id);
    const renderedTickerTable = userTickers.map((ticker) => {
      return createDefaultListItem(ticker, ticker.item_value, ticker.item_qty);
    })
    renderedTickerTable.unshift(header);
    res.send(renderedTickerTable);

  } else {
    res.sendStatus(401);
  }
})

router.post("/push", async (req, res) => {
  if (req.isAuthenticated) {
    console.log(req.body);
    try {
      const tickerResponse = await setUserTicker(req.body.item, req.body.value, req.user.id, req.body.quantity);
      console.log(tickerResponse);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(501);
    }
  } else {
    res.sendStatus(401);
  }
})

router.delete("/remove/:ticker", async (req, res) => {
  if (req.isAuthenticated) {
    console.log(req.params);
    const response = await deleteUserTickers(req.params.ticker, req.user.id);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
})

export default router;