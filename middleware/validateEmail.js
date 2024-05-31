import { joiEmailSchema } from "../schemas/avatarsSchemas.js";

const validateEmail = (req, res, next) => {
  const { error } = joiEmailSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default validateEmail;
