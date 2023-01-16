import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
//import { createClient } from "redis";
import { initRedis } from "@/utils/redis-config";
import activitiesService from "@/services/activities-service";
import { ActivitiesParams } from "@/protocols";

export async function testRedis(req: AuthenticatedRequest, res: Response) {
  try {
    const redisClient = await initRedis();
    const activities = await activitiesService.getActivitiesByDate(1, 1);
    const inserindo = await redisClient.set("activities", JSON.stringify(activities));
    const pegando: ActivitiesParams = JSON.parse(await redisClient.get("activities"));

    return res.status(httpStatus.OK).send(pegando);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
