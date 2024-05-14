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

export const idSchema = Joi.string().length(24).hex();

// Example usage:
const { error, value } = idSchema.validate("664276135f690ae8d6ef4f19");
if (error) {
  console.error("Validation error:", error);
} else {
  console.log("Valid ID:", value);
}


// Define a schema for your IDs
// export const idSchema = Joi.string().alphanum().length(10);

// // Example usage:
// const { error, value } = idSchema.validate("123abc4567");
// if (error) {
//   console.error("Validation error:", error);
// } else {
//   console.log("Valid ID:", value);
// }
