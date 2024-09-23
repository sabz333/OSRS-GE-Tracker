import Router from "express-promise-router";
import getTop5Tickers from "../functions/getTop5Tickers.js";
import dataChangeCalculation from "../functions/dataChangeCalculation.js";
import createHeaderCard from "../functions/createHeaderCard.js";
import getItemDetails from "../functions/getItemDetails.js";
import pullGraphData from "../functions/pullGraphData.js";
import graphDataExtract from "../functions/graphDataExtract.js";
import formatShort from "../functions/formatShort.js";

// router for rendering individual item page
const router = new Router();
const categoryID = 10;
const mainStyleSheet = "styles/main.css";
const options = {
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
  timeZoneName: "longOffset",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

router.get("/:id", async (req, res) => {
  const itemId = req.params.id;
  const headerItems = await getTop5Tickers(categoryID);
  const renderedCards = headerItems.map((item) => {
    return createHeaderCard(item);
  });
  const itemDetails = await getItemDetails(req.params.id);
  const itemCalcs = dataChangeCalculation(itemDetails);

  // year data min & max & average volume
  const rawYearData = await pullGraphData(req.params.id, "24h", "1Y");
  const yearData = graphDataExtract(rawYearData, "1Y");
  const yearMin = formatShort(Math.min(...yearData.price));
  const yearMax = formatShort(Math.max(...yearData.price));
  const yearAvgVol = Math.round(
    yearData.volume.reduce((a, b) => a + b, 0) / yearData.volume.length
  );

  // day data min & max
  const rawDayData = await pullGraphData(req.params.id, "5m", "1D");
  const dayData = graphDataExtract(rawDayData, "1D");
  const dayMin = formatShort(Math.min(...dayData.price));
  const dayMax = formatShort(Math.max(...dayData.price));

  // format numbers to human readble
  itemCalcs.currentPrice = formatShort(itemCalcs.currentPrice);
  itemCalcs.priceChange = formatShort(itemCalcs.priceChange);
  itemCalcs.openPrice = formatShort(itemCalcs.openPrice);

  itemDetails.high_alch = formatShort(itemDetails.high_alch);
  itemDetails.low_alch = formatShort(itemDetails.low_alch);

  res.render("item.ejs", {
    mainStyleSheet: mainStyleSheet,
    headerCardArray: renderedCards,
    catId: categoryID,
    passedItemId: itemId,
    yearMinPrice: yearMin,
    yearMaxPrice: yearMax,
    dayMinPrice: dayMin,
    dayMaxPrice: dayMax,
    averageVol: yearAvgVol,
    itemDetails: itemDetails,
    itemCalcs: itemCalcs,
    updateTime: new Intl.DateTimeFormat("en-US", options).format(
      new Date(itemDetails["last_update"] * 1000)
    ),
  });
});

export default router;