import "dotenv/config";
import * as db from "../../db/index.js";
import queries from "../../db/queries.js";
import axios from "axios";
import { JSDOM } from "jsdom";
import { DatabaseError, WebError } from "../../errors/Errors.js";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// scrapes latest news articles from Runescape website
async function getNewsArticles() {
  try {
    const newsArray = [];
    const response = await axios
      .request("https://secure.runescape.com/m=news/archive?oldschool=1", {
        responseType: "document",
      })
      .catch((err) => {
        throw new WebError("Could not fetch OSRS News Articles", {
          cause: err,
        }).display();
      });
    const dom = new JSDOM(response.data);

    const nodeList = dom.window.document.querySelectorAll(".news-list-article");

    nodeList.forEach((article) => newsArray.push(article.innerHTML));

    return newsArray;
  } catch (error) {
    return ["Could not retrieve articles"];
  }
}

// pulls top 5 items with highest volume trade in category for header card generation
async function getTop5Tickers(category) {
  try {
    const response = await db.query(queries.getTopTickers, [category]);
    return response.rows;
  } catch (error) {
    throw new DatabaseError("Could not query Top 5 Tickers from database", {
      cause: error,
    });
  }
}

// calculate current ticker pricing based on opening values
function dataChangeCalculation(itemObject) {
  // Data integrity check
  if (!itemObject["high_vol"] && !itemObject["low_vol"]) {
    itemObject["high_vol"] = 1;
    itemObject["low_vol"] = 1;
  }

  if (!itemObject["high_price"]) {
    itemObject["high_price"] = itemObject["open_high"];
  }

  if (!itemObject["low_price"]) {
    itemObject["low_price"] = itemObject["open_low"];
  }

  // Calculations
  const highVolWeight =
    itemObject["high_vol"] / (itemObject["high_vol"] + itemObject["low_vol"]);
  const lowVolWeight =
    itemObject["low_vol"] / (itemObject["high_vol"] + itemObject["low_vol"]);
  const currentPrice = Math.round(
    itemObject["high_price"] * highVolWeight +
      itemObject["low_price"] * lowVolWeight
  );
  const openHighVolWeight =
    itemObject["open_high_vol"] /
    (itemObject["open_high_vol"] + itemObject["open_low_vol"]);
  const openLowVolWeight =
    itemObject["open_low_vol"] /
    (itemObject["open_high_vol"] + itemObject["open_low_vol"]);

  const openingPrice = Math.round(
    itemObject["open_high"] * openHighVolWeight +
      itemObject["open_low"] * openLowVolWeight
  );
  const percentChange = ((currentPrice - openingPrice) / openingPrice) * 100;
  const priceChange = currentPrice - openingPrice;
  let arrow = "";
  let change = "";

  // Set item arrows and coloring
  if (priceChange > 0) {
    arrow = "arrow_upward";
    change = "positive";
  } else if (priceChange === 0) {
    arrow = "trending_flat";
    change = "flat";
  } else {
    arrow = "arrow_downward";
    change = "negative";
  }

  return {
    id: itemObject.id,
    currentPrice: currentPrice,
    percentChange: percentChange.toFixed(2),
    priceChange: priceChange,
    arrow: arrow,
    change: change,
    openPrice: openingPrice,
  };
}

// function to create top mover item card
function createHeaderCard(itemObject) {
  const values = dataChangeCalculation(itemObject);

  return `<div class="topHeaderCardDiv">
  <a class="headerCardLink" href="/item/${values.id}">
  <div class="headerCard container d-flex flex-row align-items-center p-2">
    <div
      class="price-arrow ${
        values.change
      } d-flex justify-content-center align-items-center"
    >
      <span class="material-symbols-rounded">${values.arrow}</span>
    </div>
    <div class="itemPriceInfo d-flex flex-column">
      <div class="itemId">${itemObject.name}</div>
      <div class="itemPrice">${formatShort(values.currentPrice)}</div>
    </div>
    <div class="itemPercentInfo ${values.change} d-flex flex-column flex-fill">
      <div class="itemPercentChange">${values.percentChange}%</div>
      <div class="itemValueChange">${formatShort(values.priceChange)}</div>
    </div>
    </div>
    </a>
  </div>`;
}

// pulls item details from postgres db
async function getItemDetails(itemNumber) {
  try {
    const response = await db.query(queries.getItemDetails, [itemNumber]);
    return response.rows[0];
  } catch (error) {
    throw new DatabaseError("Could not retrieve item details from database", {
      cause: error,
    });
  }
}

// returns rows of items matching search description
async function searchItemDatabase(searchString) {
  try {
    const response = await db.query(queries.itemSearchQuery, [searchString]);
    return response.rows;
  } catch (error) {
    throw new DatabaseError("Search query failed", { cause: error });
  }
}

// creates searchBox results
function createSearchResult(itemObject) {
  const values = dataChangeCalculation(itemObject);

  return `<div class="searchResult">
  <a class="searchResultLink" href="/item/${values.id}">
  <div class="searchResultInfo">
    <div>
      <div class="foundItem">
        ${itemObject.name}
      </div>
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
        values.id
      }"></img>
    </div>
    <div class="foundItemPricing">
      <div class="foundItemPrice">
          ${formatShort(values.currentPrice)}
      </div>
      <span class="roundedPercentContainer d-flex ${values.change}">
        <div>
          <span class="material-symbols-rounded d-flex arrow">${
            values.arrow
          }</span>
        </div>
        ${values.percentChange}%
      </span>
    </div>
  </div>
  </a>
</div>`;
}

// function to pull timeseries data from OSRS wiki api
async function pullGraphData(id, timeScale, chartTimeScale) {
  try {
    const response = await axios
      .request({
        url: "/timeseries",
        baseURL: "https://prices.runescape.wiki/api/v1/osrs",
        params: {
          id: id,
          timestep: timeScale,
        },
        headers: {
          "User-Agent": process.env.USER_AGENT_HEADER,
        },
      })
      .catch((err) => {
        throw new WebError("Could not fetch Graph data from Wiki", {
          cause: err,
        }).display();
      });

    // required to determine number of points since start of day
    const UTCMidnight = new Date();
    UTCMidnight.setUTCHours(0);
    UTCMidnight.setUTCMinutes(0);
    UTCMidnight.setUTCSeconds(0);
    UTCMidnight.setUTCMilliseconds(0);

    const timeSince = Date.now() - UTCMidnight.getTime();
    const pointsInDay = Math.floor(timeSince / 300000) * -1;
    let midnightIndex = -1;

    var trimmedData;

    // switch statement to trim data approriately based on user selection and timestep
    switch (chartTimeScale) {
      case "1D":
        for (let i = 0; i < response.data.data.length; i++) {
          if (
            response.data.data[i]["timestamp"] ===
            UTCMidnight.getTime() / 1000
          ) {
            midnightIndex = i;
            break;
          }
        }
        if (midnightIndex >= 0) {
          trimmedData = response.data.data.slice(midnightIndex);
        } else {
          trimmedData = response.data.data.slice(pointsInDay);
        }
        break;
      case "5D":
        trimmedData = response.data.data.slice(-121);
        break;
      case "1M":
        trimmedData = response.data.data.slice(-121);
        break;
      case "6M":
        trimmedData = response.data.data.slice(-182);
        break;
      case "1Y":
        trimmedData = response.data.data;
        break;
      default:
        console.log("timeScale not read");
        trimmedData = response.data.data;
    }

    return trimmedData;
  } catch (error) {
    throw error;
  }
}

// function to manipulate graph data and output desired price averaging and info
function graphDataExtract(wikiData, chartTimeScale) {
  const priceArr = [];
  const volumeArr = [];
  const timeArr = [];
  const toolTipArr = [];
  var options;
  var optionsTooltip;

  // switch statement used to format time based on user selection
  switch (chartTimeScale) {
    case "1D":
      options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      optionsTooltip = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZoneName: "short",
      };
      break;
    case "5D":
      options = {
        month: "short",
        day: "numeric",
      };
      optionsTooltip = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZoneName: "short",
      };
      break;
    case "1M":
      options = {
        month: "short",
        day: "numeric",
      };
      optionsTooltip = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZoneName: "short",
      };
      break;
    case "6M":
      options = {
        month: "short",
        year: "numeric",
      };
      optionsTooltip = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      break;
    case "1Y":
      options = {
        month: "short",
        year: "numeric",
      };
      optionsTooltip = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      break;
    default:
      console.log("timeScale not read");
      options = {};
  }

  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);
  const dateTimeFormatTooltip = new Intl.DateTimeFormat(
    "en-US",
    optionsTooltip
  );

  wikiData.forEach((row) => {
    // Calculations
    const volumeTotal = row["highPriceVolume"] + row["lowPriceVolume"];
    const highVolWeight = row["highPriceVolume"] / volumeTotal;
    const lowVolWeight = row["lowPriceVolume"] / volumeTotal;
    const actualPrice = Math.round(
      row["avgHighPrice"] * highVolWeight + row["avgLowPrice"] * lowVolWeight
    );

    priceArr.push(actualPrice);
    volumeArr.push(volumeTotal);
    timeArr.push(dateTimeFormat.format(new Date(row["timestamp"] * 1000)));
    toolTipArr.push(
      dateTimeFormatTooltip.format(new Date(row["timestamp"] * 1000))
    );
  });

  return {
    price: priceArr,
    volume: volumeArr,
    time: timeArr,
    toolTip: toolTipArr,
    priceChange: formatShort(priceArr.at(-1) - priceArr[0]),
  };
}

// function to format numeric values to OSRS standard
function formatShort(number) {
  const digits = 2;

  const lookup = [
    { value: 1, symbol: " gp" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const newNumber = lookup.findLast((item) => Math.abs(number) >= item.value);

  return newNumber
    ? (number / newNumber.value)
        .toFixed(digits)
        .replace(regexp, "")
        .concat(newNumber.symbol)
    : "0";
}

// function to pull top items based on vol from db
async function topItemsList() {
  try {
    const response = await db.query(queries.getTopItems);
    return response.rows;
  } catch (error) {
    throw new DatabaseError("Could not fetch Top Items List", { cause: error });
  }
}

// create list item for top items trading
function createTopMoverListItem(itemObject) {
  const values = dataChangeCalculation(itemObject);

  return `<li>
  <a class="listItemLink" href="/item/${values.id}">
  <div class="listItem">
    <div class="listImage">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
        values.id
      }" alt="item image">
      <div class="listName">
        <div class="listNameText">
          ${itemObject.name}
        </div>
      </div>
    </div>
    <div class="listItemContent">
      <span>
        <div class="d-flex align-items-center listItemContent">${formatShort(
          values.currentPrice
        )}</div>
      </span>
    </div>
    <div class="listItemContent amountChanged">
      <div style="height: 24px;">
        <span class="${values.change}">
        ${formatShort(values.priceChange)}
        </span>
      </div>
    </div>
    <div class="listItemContent">
      <span class="listPercentChange ${values.change}">
        <div class="listPercentChangeText">
          <span class="material-symbols-rounded d-flex">${values.arrow}</span>
          ${values.percentChange}%
        </div>
      </span>
    </div>
  </div>
  </a>
</li>`;
}

export {
  months,
  getNewsArticles,
  getTop5Tickers,
  dataChangeCalculation,
  createHeaderCard,
  getItemDetails,
  searchItemDatabase,
  createSearchResult,
  pullGraphData,
  graphDataExtract,
  formatShort,
  topItemsList,
  createTopMoverListItem,
};
