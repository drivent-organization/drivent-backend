import { singInPost } from "@/controllers";
import { validateBody, validateParams } from "@/middlewares";
import { signInSchema, oAuthUserSchema, oAuthParamsSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);
authenticationRouter.post(
  "/sign-in/:oAuth",
  validateBody(oAuthUserSchema),
  validateParams(oAuthParamsSchema),
  singInPost,
);

export { authenticationRouter };
