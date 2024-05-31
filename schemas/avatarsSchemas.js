import Joi from "joi";

const emailRegexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export const joiEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": "Field {#label} must be a valid email address.",
    "any.required": "missing required {#label} field",
  }),
});
