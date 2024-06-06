import "dotenv/config";
import cron from "node-cron";
import express from "express";
import mountRoutes from "./routes/index.js";
import bodyParser from "body-parser";
import { getLatestItemData } from "./Scripts/tickerUpdate.js";
import { openingValuePull } from "./Scripts/tickerUpdateStartofDay.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("public"));
app.use("/item", express.static("public"));

mountRoutes(app);

cron.schedule("*/5 * * * *", () => getLatestItemData(), {
  scheduled: true,
});

cron.schedule("5 0 * * *", () => openingValuePull(), {
  scheduled: true,
  timezone: "Etc/UTC",
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});