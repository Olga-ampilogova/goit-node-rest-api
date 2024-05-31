import express from "express";
import authController from "../controllers/usersControllers.js";
import authMiddleWare from "../middleware/auth.js";
import { createUserSchema, authUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";

const userRouter = express.Router();

const BASE_URL = "/api/auth";

userRouter.post(
  "/register",
  validateBody(createUserSchema),
  authController.register
);
userRouter.post("/login", validateBody(authUserSchema), authController.login);
userRouter.post("/logout", authMiddleWare, authController.logout);
userRouter.get("/current", authMiddleWare, authController.current);
userRouter.patch("/users", authMiddleWare, authController.update);

export default userRouter;
