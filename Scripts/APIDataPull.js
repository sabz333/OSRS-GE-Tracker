import * as db from "../db/index.js";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://services.runescape.com/m=itemdb_oldschool/api/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let data = [];

async function getCategories() {
  try {
    const response = await axios.request("catalogue/category.json", {
      method: "get",
      baseURL: API_URL,
      params: {
        category: 1,
      },
    });
    return response.data.alpha;
  } catch (error) {
    console.error(error);
  }
}

async function getData(searchAlpha, itemCount) {
  const round = Math.ceil(itemCount/12);
  for(let i = 1; i <= round; i++) {
    try {
      const response = await axios.request("catalogue/items.json", {
        method: "get",
        baseURL: API_URL,
        params: {
          category: 1,
          alpha: searchAlpha,
          page: i,
        },
      });
      let items = response.data.items;
  
      await items.forEach((item) => {
        db.query(
          "INSERT INTO items (id, icon, icon_large, name, description) VALUES ($1, $2, $3, $4, $5)",
          [item.id, item.icon, item.icon_large, item.name, item.description]
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
  console.log(searchAlpha);
}

// getData();
data = await getCategories();
console.log(data);

// getData(data[26].letter, data[26].items);

// data.forEach(index => {
//   getData(index.letter, index.items);
// });
