import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { registerActivities } from "@/controllers";

const registerActivitiesRouter = Router();

registerActivitiesRouter
  .all("/*", authenticateToken)
  .post("/process", registerActivities);

export{ registerActivitiesRouter };
