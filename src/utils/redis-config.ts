import exp from "constants";
import { createClient } from "redis";

const initRedis = async () => {
  const redisClient = createClient();
  await redisClient.connect();
  return redisClient;
};

export { initRedis };
