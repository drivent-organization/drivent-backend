import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivitiesDates, listActivitiesByDate, subscribeToActivity, listPlaces } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", listActivitiesDates)
  .get("/places", listPlaces)
  .get("/:dateId", listActivitiesByDate)
  .post("/process", subscribeToActivity);

export { activitiesRouter };
