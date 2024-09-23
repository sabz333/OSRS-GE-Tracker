import "dotenv/config";
import axios from "axios";
import { WebError } from "../errors/Errors.js";

// function to pull timeseries data from OSRS wiki api
export default async function pullGraphData(id, timeScale, chartTimeScale) {
  try {
    const response = await axios
      .request({
        url: "/timeseries",
        baseURL: "https://prices.runescape.wiki/api/v1/osrs",
        params: {
          id: id,
          timestep: timeScale,
        },
        headers: {
          "User-Agent": process.env.USER_AGENT_HEADER,
        },
      })
      .catch((err) => {
        throw new WebError("Could not fetch Graph data from Wiki", {
          cause: err,
        }).display();
      });

    // required to determine number of points since start of day
    const UTCMidnight = new Date();
    UTCMidnight.setUTCHours(0);
    UTCMidnight.setUTCMinutes(0);
    UTCMidnight.setUTCSeconds(0);
    UTCMidnight.setUTCMilliseconds(0);

    const timeSince = Date.now() - UTCMidnight.getTime();
    const pointsInDay = Math.floor(timeSince / 300000) * -1;
    let midnightIndex = -1;

    var trimmedData;

    // switch statement to trim data approriately based on user selection and timestep
    switch (chartTimeScale) {
      case "1D":
        for (let i = 0; i < response.data.data.length; i++) {
          if (
            response.data.data[i]["timestamp"] ===
            UTCMidnight.getTime() / 1000
          ) {
            midnightIndex = i;
            break;
          }
        }
        if (midnightIndex >= 0) {
          trimmedData = response.data.data.slice(midnightIndex);
        } else {
          trimmedData = response.data.data.slice(pointsInDay);
        }
        break;
      case "5D":
        trimmedData = response.data.data.slice(-121);
        break;
      case "1M":
        trimmedData = response.data.data.slice(-121);
        break;
      case "6M":
        trimmedData = response.data.data.slice(-182);
        break;
      case "1Y":
        trimmedData = response.data.data;
        break;
      default:
        console.log("timeScale not read");
        trimmedData = response.data.data;
    }

    return trimmedData;
  } catch (error) {
    throw error;
  }
}