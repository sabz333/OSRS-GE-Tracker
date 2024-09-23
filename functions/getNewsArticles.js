import axios from "axios";
import { JSDOM } from "jsdom";
import { WebError } from "../errors/Errors.js";

// scrapes latest news articles from Runescape website
export default async function getNewsArticles() {
  try {
    const newsArray = [];
    const response = await axios
      .request("https://secure.runescape.com/m=news/archive?oldschool=1", {
        responseType: "document",
      })
      .catch((err) => {
        throw new WebError("Could not fetch OSRS News Articles", {
          cause: err,
        }).display();
      });
    const dom = new JSDOM(response.data);

    const nodeList = dom.window.document.querySelectorAll(".news-list-article");

    nodeList.forEach((article) => newsArray.push(article.innerHTML));

    return newsArray;
  } catch (error) {
    return ["Could not retrieve articles"];
  }
}