import * as db from "../db/index.js";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://prices.runescape.wiki/api/v1/osrs/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let data = [];

async function getData() {
  try {
    const response = await axios.request("mapping", {
      method: "get",
      baseURL: API_URL,
      headers: {
        'User-Agent': 'OSRS GE Tracker Website - @Sabz333 on the wiki & discord'
      },
    });
    data = response.data;

    await data.forEach(item => {
      db.query("INSERT INTO wiki_items (id, name, description, members, trade_limit, low_alch, high_alch) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
      [item.id, item.name, item.examine, item.members, item.limit, item.lowalch, item.highalch]);
    });
  } catch (error) {
    console.log(error);
  }
}

getData();