const getTopTickers = `
SELECT ticker_summary.id as ticker_id,
  open_high,
  open_low,
  high_price,
  low_price,
  high_vol,
  low_vol,
  open_high_vol,
  open_low_vol,
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

const updateOpenHighVol = `
UPDATE ticker_summary
SET open_high_vol = x."highPriceVolume"
FROM json_to_recordset($1)
  AS x ("avgHighPrice" INT,
    "highPriceVolume" INT,
    "avgLowPrice" INT,
    "lowPriceVolume" INT,
    "id" INT)
WHERE ticker_summary.id = x."id"
  AND x."highPriceVolume" IS NOT NULL;`;

const updateOpenLowVol = `
UPDATE ticker_summary
SET open_low_vol = x."lowPriceVolume"
FROM json_to_recordset($1)
  AS x ("avgHighPrice" INT,
    "highPriceVolume" INT,
    "avgLowPrice" INT,
    "lowPriceVolume" INT,
    "id" INT)
WHERE ticker_summary.id = x."id"
  AND x."lowPriceVolume" IS NOT NULL;`;

const getItemDetails = `
SELECT ticker_summary.id as ticker_id,
  icon,
  icon_large,
  name,
  description,
  category,
  members,
  trade_limit,
  low_alch,
  high_alch,
  open_high,
  open_low,
  high_price,
  low_price,
  high_vol,
  low_vol,
  open_high_vol,
  open_low_vol,
  last_update
FROM items
JOIN ticker_summary ON items.id = ticker_summary.id
WHERE items.id = $1;`;

const itemSearchQuery = `
SELECT items.id as ticker_id, items.name, open_high, open_low, high_vol, low_vol, high_price, low_price, open_high_vol, open_low_vol
FROM items
JOIN ticker_summary ON items.id = ticker_summary.id
WHERE items.name ILIKE '%' || $1 || '%'
ORDER BY name ASC;`;

const getTopItems = `
SELECT ticker_summary.id as ticker_id, open_high, open_low, high_price, low_price, high_vol, low_vol, name, open_high_vol, open_low_vol
FROM ticker_summary
JOIN items ON items.id = ticker_summary.id
WHERE high_vol IS NOT NULL
AND low_vol IS NOT NULL
AND category != 11
AND open_high > 10
ORDER BY high_vol DESC
LIMIT 15;`;

const findUser = `
SELECT * FROM users
WHERE email = $1;`;

const createNewUser = `
INSERT INTO users (firstName, lastName, email, password)
VALUES ($1, $2, $3, $4)
RETURNING id;`;

const createNewUserTickers = `
INSERT INTO ticker_users (item_id, item_value, item_qty, user_id)
VALUES ($1, $2, $3, $4);`;

const getUserTickers = `
SELECT ticker_summary.id as ticker_id, open_high, open_low, high_price, low_price, high_vol, low_vol, name, open_high_vol, open_low_vol, ticker_users.id as watch_id, item_value, item_qty
FROM ticker_summary
JOIN items ON items.id = ticker_summary.id
JOIN ticker_users ON ticker_users.item_id = ticker_summary.id
WHERE ticker_users.user_id = $1;`

const getSingleTicker = `
SELECT ticker_summary.id as ticker_id, open_high, open_low, high_price, low_price, high_vol, low_vol, name, open_high_vol, open_low_vol, ticker_users.id as watch_id, item_value, item_qty
FROM ticker_summary
JOIN items ON items.id = ticker_summary.id
JOIN ticker_users ON ticker_users.item_id = ticker_summary.id
WHERE ticker_users.user_id = $1 AND ticker_users.id = $2;`;

const pushUserTicker = `
INSERT INTO ticker_users (user_id, item_id, item_value, item_qty)
VALUES ($3, $1, $2, $4)`;

const updateUserTicker = `
UPDATE ticker_users
SET
  item_value = $1,
  item_qty = $2
WHERE
  ticker_users.id = $3 AND user_id = $4;`;

const deleteUserTicker = `
DELETE FROM ticker_users
WHERE id = $1 AND user_id = $2`;


export default {
  getTopTickers,
  updateTickerSummaryData, 
  updateTickerLastUpdate,
  updateOpenHighPrice,
  updateOpenLowPrice,
  updateOpenHighVol,
  updateOpenLowVol,
  getItemDetails,
  itemSearchQuery,
  getTopItems,
  findUser,
  createNewUser,
  createNewUserTickers,
  getUserTickers,
  getSingleTicker,
  pushUserTicker,
  updateUserTicker,
  deleteUserTicker,
};
