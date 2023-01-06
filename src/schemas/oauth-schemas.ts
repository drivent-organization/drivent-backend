import Joi from "joi";

export const oAuthUserSchema = Joi.object<{ email: string }>({
  email: Joi.string().email().required(),
});

export const oAuthParamsSchema = Joi.object<{ oAuth: string }>({
  oAuth: Joi.string().trim().required(),
});
