import * as db from "../db/index.js";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://services.runescape.com/m=itemdb_oldschool/api/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getItems() {
  const query = "SELECT * FROM items WHERE icon ISNULL";

  try {
    const response = await db.query(query);
    return response.rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAPIData() {
  const data = await getItems();
  for(let i = 0; i < data.length; i++) {
    try {
      const response = await axios.request("catalogue/detail.json", {
        method: "get",
        baseURL: API_URL,
        params: {
          item: data[i].id,
        },
      });
  
      let item = response.data.item;
  
      await db.query("UPDATE items SET (icon, icon_large) = ($1, $2) WHERE items.id = $3", [item.icon, item['icon_large'], data[i].id])
    } catch (error) {
      console.log(error);
    }
  };
}

getAPIData();