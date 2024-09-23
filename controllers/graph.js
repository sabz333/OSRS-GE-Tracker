import Router from "express-promise-router";
import {
  pullGraphData,
  graphDataExtract,
} from "./util/functions.js"

const router = new Router();

// router for graph data request of individual item based on time scale
router.get("/", async (req, res) => {
  const request = req.query;
  const rawGraphData = await pullGraphData(request.id, request.timestep, request.timeScale);
  const transformedGraphData = graphDataExtract(rawGraphData, request.timeScale);
  
  res.send(transformedGraphData);
})

export default router;