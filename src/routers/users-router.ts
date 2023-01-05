import { Router } from "express";

import { createUserSchema, oAuthUserSchema, oAuthParamsSchema } from "@/schemas";
import { validateBody, validateParams } from "@/middlewares";
import { usersPost } from "@/controllers";

const usersRouter = Router();

usersRouter.post("/", validateBody(createUserSchema), usersPost);
usersRouter.post("/:type", validateBody(oAuthUserSchema), validateParams(oAuthParamsSchema), usersPost);

export { usersRouter };
