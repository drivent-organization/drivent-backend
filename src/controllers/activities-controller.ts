import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function listActivitiesDates(req: AuthenticatedRequest, res: Response) {
  try {
    const dates = await activitiesService.getActivitiesDates();
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
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
