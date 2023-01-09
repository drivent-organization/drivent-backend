import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function listActivitiesDates(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const dates = await activitiesService.getActivitiesDates(userId);
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "CannotSelectActivitiesError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function listActivitiesByDate(req: AuthenticatedRequest, res: Response) {
  const dateId = Number(req.params.dateId);
  if (!dateId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const activities = await activitiesService.getActivitiesByDate(dateId);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function subscribeToActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { activityId } = req.body;
   
    if (!activityId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const subscribedActivity = await activitiesService.subscribeInActivity(userId, activityId);
    return res.status(httpStatus.OK).send(subscribedActivity);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "ConflictError") {
      return res.sendStatus(httpStatus.CONFLICT);
    }
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function listPlaces(req: AuthenticatedRequest, res: Response) {
  try {
    const places = await activitiesService.getPlaces();
    return res.status(httpStatus.OK).send(places);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
