// calculate current ticker pricing based on opening values
export default function dataChangeCalculation(itemObject) {
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