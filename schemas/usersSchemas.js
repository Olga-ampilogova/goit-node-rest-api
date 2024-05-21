import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

export const authUserSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});