import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listActivitiesDates } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken)
  .get("", listActivitiesDates)
  .get("/:dateId");

export { activitiesRouter };
