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
const dateOptions = {
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
  timeZoneName: "longOffset",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

router.get("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const dashboardEnable = req.isAuthenticated();
    
    // Fetch data in parallel
    const [headerItems, itemDetails, rawYearData, rawDayData] = await Promise.all(
      [
        getTop5Tickers(categoryID),
        getItemDetails(itemId),
        pullGraphData(itemId, "24h", "1Y"),
        pullGraphData(itemId, "5m", "1D"),
      ]
    );
    
    const itemCalcs = dataChangeCalculation(itemDetails);
    const yearData = graphDataExtract(rawYearData, "1Y");
    const dayData = graphDataExtract(rawDayData, "1D");
  
    // year data min & max & average volume
    const yearMin = formatShort(Math.min(...yearData.price));
    const yearMax = formatShort(Math.max(...yearData.price));
    const yearAvgVol = Math.round(
      yearData.volume.reduce((a, b) => a + b, 0) / yearData.volume.length
    );
  
    // day data min & max
    const dayMin = formatShort(Math.min(...dayData.price));
    const dayMax = formatShort(Math.max(...dayData.price));
  
    // format numbers to human readble
    itemCalcs.currentPrice = formatShort(itemCalcs.currentPrice);
    itemCalcs.priceChange = formatShort(itemCalcs.priceChange);
    itemCalcs.openPrice = formatShort(itemCalcs.openPrice);
  
    itemDetails.high_alch = formatShort(itemDetails.high_alch);
    itemDetails.low_alch = formatShort(itemDetails.low_alch);
  
    const updateTime = new Intl.DateTimeFormat("en-US", dateOptions).format(
      new Date(itemDetails.last_update * 1000)
    );
  
    res.render("item.ejs", {
      mainStyleSheet: mainStyleSheet,
      headerCardArray: headerItems.map(createHeaderCard),
      catId: categoryID,
      passedItemId: itemId,
      yearMinPrice: yearMin,
      yearMaxPrice: yearMax,
      dayMinPrice: dayMin,
      dayMaxPrice: dayMax,
      averageVol: yearAvgVol,
      itemDetails: itemDetails,
      itemCalcs: itemCalcs,
      updateTime: updateTime,
      dashboardBoolean: dashboardEnable,
    });
  } catch (error) {
    console.error("Error rendering item page: ", error);
  }
});

export default router;
