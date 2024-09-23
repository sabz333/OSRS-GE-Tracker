import formatShort from "./formatShort.js";

// function to manipulate graph data and output desired price averaging and info
export default function graphDataExtract(wikiData, chartTimeScale) {
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