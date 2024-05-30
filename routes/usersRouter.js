import express from "express";
import avatarUserControllers from "../controllers/avatarUserControllers.js";
import uploadMiddleware from "../middleware/upload.js";

const avatarRouter = express.Router();

avatarRouter.get("/avatars", avatarUserControllers.getAvatar);

avatarRouter.patch("/avatars",uploadMiddleware.single("avatar"),avatarUserControllers.uploadAvatar);

export default avatarRouter;
