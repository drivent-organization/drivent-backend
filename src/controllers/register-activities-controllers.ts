import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import registerActivitiesService from "@/services/register-activities-service";

export async function registerActivities(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { activityId } = req.body;
   
    if (!activityId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const activities = registerActivitiesService.registerActivities(userId, activityId);
    
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
