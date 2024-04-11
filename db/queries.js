const getTopTickers = `
SELECT ticker_summary.id,
  open_high,
  open_low,
  high_price,
  low_price,
  high_vol,
  low_vol,
  name,
  icon
FROM ticker_summary 
JOIN items ON items.id = ticker_summary.id 
WHERE category = $1 
  AND high_vol IS NOT NULL 
  AND low_vol IS NOT NULL 
ORDER BY high_vol DESC 
LIMIT 5;`;

const updateTickerSummaryData = `
UPDATE ticker_summary
SET high_price = x."avgHighPrice",
  low_price = x."avgLowPrice",
  high_vol = x."highPriceVolume",
  low_vol = x."lowPriceVolume"
FROM json_to_recordset($1)
  AS x ("avgHighPrice" INT,
    "highPriceVolume" INT,
    "avgLowPrice" INT,
    "lowPriceVolume" INT,
    "id" INT)
WHERE ticker_summary.id = x."id";`;

const updateTickerLastUpdate = `
UPDATE ticker_summary
SET last_update = $1;`;

const updateOpenHighPrice = `
UPDATE ticker_summary
SET open_high = x."avgHighPrice"
FROM json_to_recordset($1)
  AS x ("avgHighPrice" INT,
    "highPriceVolume" INT,
    "avgLowPrice" INT,
    "lowPriceVolume" INT,
    "id" INT)
WHERE ticker_summary.id = x."id"
  AND x."avgHighPrice" IS NOT NULL;`;

const updateOpenLowPrice = `
UPDATE ticker_summary
SET open_low = x."avgLowPrice"
FROM json_to_recordset($1)
  AS x ("avgHighPrice" INT,
  "highPriceVolume" INT,
  "avgLowPrice" INT,
  "lowPriceVolume" INT,
  "id" INT)
WHERE ticker_summary.id = x."id"
  AND x."avgLowPrice" IS NOT NULL;`;

const getItemDetails = `
SELECT * FROM items
JOIN ticker_summary ON items.id = ticker_summary.id
WHERE items.id = $1;`;

const itemSearchQuery = `
SELECT items.id, items.name, open_high, open_low, high_vol, low_vol, high_price, low_price FROM items
JOIN ticker_summary ON items.id = ticker_summary.id
WHERE items.name ILIKE '%' || $1 || '%'
ORDER BY name ASC;`;

const getTopItems = `
SELECT ticker_summary.id, open_high, open_low, high_price, low_price, high_vol, low_vol, name
FROM ticker_summary
JOIN items ON items.id = ticker_summary.id
WHERE high_vol IS NOT NULL
AND low_vol IS NOT NULL
AND category != 11
AND open_high > 10
ORDER BY high_vol DESC
LIMIT 15;`;


export default {
  getTopTickers,
  updateTickerSummaryData, 
  updateTickerLastUpdate,
  updateOpenHighPrice,
  updateOpenLowPrice,
  getItemDetails,
  itemSearchQuery,
  getTopItems,
};
