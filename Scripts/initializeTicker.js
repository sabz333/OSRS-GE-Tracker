import * as db from "../db/index.js";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://prices.runescape.wiki/api/v1/osrs/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function openingValuePull() {
  const date = new Date();
  date.setUTCHours(0,0,0,0);

  
  try {
    const response = await axios.request("latest", {
      method: "get",
      baseURL: API_URL,
      headers: {
        'User-Agent': 'OSRS GE Tracker Website - @Sabz333 on the wiki & discord'
      },
    });

    const array = Object.keys(response.data.data).map(key => {
      let obj = response.data.data[key];
      obj['id'] = key;
      return obj;
    });

    // console.log(JSON.stringify(array));
    
    await db.query(`INSERT INTO ticker_summary (id, open_high, open_low) SELECT x."id", x."high", x."low" FROM json_to_recordset($1) AS x ("high" INT, "highTime" INT, "low" INT, "lowTime" INT, "id" INT) JOIN items USING (id);`, [JSON.stringify(array)]);
    
  } catch (error) {
    console.log(error);
  }
}

openingValuePull();