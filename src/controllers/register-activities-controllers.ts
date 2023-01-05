import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import registerActivitiesService from "@/services/register-activities-service";

export async function registerActivities( req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { activitieId } = req.body;
       
    if (!activitieId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const activities = registerActivitiesService.registerActivities(userId, activitieId);

    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
