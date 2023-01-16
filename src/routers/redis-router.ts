import { Router } from "express";

import { testRedis } from "@/controllers";

const redisRouter = Router();

redisRouter.get("/", testRedis);

export { redisRouter };
