import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivitiesDates, listActivitiesByDate, registerActivities } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  // .all("/*", authenticateToken)
  .get("", listActivitiesDates)
  .get("/:dateId", listActivitiesByDate)
  .post("/process", registerActivities);

export { activitiesRouter };
