import { initRedis } from "@/utils/redis-config";
import { ActivityData } from "@/protocols";

async function findActivitiesByDate(activitiesKey: string): Promise<ActivityData[]> {
  const redisClient = await initRedis();
  const getActivitiesFromRedis: ActivityData[] = JSON.parse(await redisClient.get(activitiesKey));
  return getActivitiesFromRedis;
}

async function insertActivitiesByDate(activitiesKey: string, activitiesData: ActivityData[]) {
  const redisClient = await initRedis();
  await redisClient.set(activitiesKey, JSON.stringify(activitiesData));
}

const redisRepository = {
  findActivitiesByDate,
  insertActivitiesByDate,
};

export default redisRepository;
