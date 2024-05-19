import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().optional().min(2),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
});

export const updateFavoriteField = Joi.object(
  {
    favorite: Joi.boolean().required()
  }
)


