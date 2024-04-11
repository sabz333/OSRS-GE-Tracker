import * as db from "../db/index.js";
import queries from "../db/queries.js";
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
    const response = await axios.request("5m", {
      method: "get",
      baseURL: API_URL,
      headers: {
        'User-Agent': 'OSRS GE Tracker Website - @Sabz333 on the wiki & discord'
      },
      params: {
        timestamp: date.valueOf()/1000,
      },
    });

    const array = Object.keys(response.data.data).map(key => {
      let obj = response.data.data[key];
      obj['id'] = key;
      return obj;
    });

    // console.log(JSON.stringify(array));
    
    db.query(queries.updateOpenHighPrice, [JSON.stringify(array)]);
    db.query(queries.updateOpenLowPrice, [JSON.stringify(array)]);
    
  } catch (error) {
    console.log(error);
  }
}

openingValuePull();