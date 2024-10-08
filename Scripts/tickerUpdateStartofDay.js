import "dotenv/config";
import * as db from "../db/index.js";
import queries from "../db/queries.js";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { WebError } from "../errors/Errors.js";

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
        'User-Agent': process.env.USER_AGENT_HEADER,
      },
      params: {
        timestamp: date.valueOf()/1000,
      },
    }).catch((err) => {throw new WebError("Could not pull 00:00 UTC wiki data", {cause: err}).display()});

    const array = Object.keys(response.data.data).map(key => {
      let obj = response.data.data[key];
      obj['id'] = key;
      return obj;
    });
    
    db.query(queries.updateOpenHighPrice, [JSON.stringify(array)]);
    db.query(queries.updateOpenLowPrice, [JSON.stringify(array)]);
    db.query(queries.updateOpenHighVol, [JSON.stringify(array)]);
    db.query(queries.updateOpenLowVol, [JSON.stringify(array)]);
    
  } catch (error) {
    throw(error);
  }
}

export {openingValuePull};