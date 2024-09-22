import "dotenv/config";
import cron from "node-cron";
import express from "express";
import mountRoutes from "./routes/index.js";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/errorhandlers.js";
import { getLatestItemData } from "./Scripts/tickerUpdate.js";
import { openingValuePull } from "./Scripts/tickerUpdateStartofDay.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("public"));
app.use("/item", express.static("public"));

mountRoutes(app);

// update day values on first startup
openingValuePull();

// cron schedule to automatically update item values every 5 min
cron.schedule("1-56/5 * * * *", () => getLatestItemData(), {
  scheduled: true,
});

// cron scheudle to automatically update opening values daily at 00:06 UTC
cron.schedule("6 0 * * *", () => openingValuePull(), {
  scheduled: true,
  timezone: "Etc/UTC",
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

app.use(errorHandler);