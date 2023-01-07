import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivitiesDates, listActivitiesByDate, registerActivities, listPlaces } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", listActivitiesDates)
  .get("/places", listPlaces)
  .get("/:dateId", listActivitiesByDate)
  .post("/process", registerActivities);

export { activitiesRouter };
