import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivitiesDates, listActivitiesByDate } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken).get("", listActivitiesDates).get("/:dateId", listActivitiesByDate);

export { activitiesRouter };
