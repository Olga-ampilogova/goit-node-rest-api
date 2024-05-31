import express from "express";
import avatarUserControllers from "../controllers/avatarUserControllers.js";
import uploadMiddleware from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";
import validateBody from "../helpers/validateBody.js";
import { joiEmailSchema } from "../schemas/avatarsSchemas.js";
import validateEmail from "../middleware/validateEmail.js";
const avatarRouter = express.Router();

avatarRouter.get("/verify/:verificationToken", avatarUserControllers.verify);

avatarRouter.post(
  "/verify",
  validateBody(joiEmailSchema),
  validateEmail,
  avatarUserControllers.verifyConfirmation
);

avatarRouter.get("/avatars", authMiddleware, avatarUserControllers.getAvatar);

avatarRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  avatarUserControllers.uploadAvatar
);

export default avatarRouter;
