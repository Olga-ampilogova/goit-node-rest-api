import { User } from "../models/users.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import { fileURLToPath } from "node:url";

async function getAvatar(req, res, next) {
  try {
    const userAvatar = await User.findById(req.user.id);
    if (!userAvatar) {
      throw HttpError(404, "User not found");
    }
    if (!userAvatar.avatarURL) {
      throw HttpError(404, "Avatar not found");
    }
    res.sendFile(path.resolve("public", userAvatar.avatarURL));
  } catch (error) {
    next(error);
  }
}
async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
     throw HttpError(400,  "No file uploaded");
      }
    const filePath = req.file.path;
  
      let avatar;
      try {
    avatar = await Jimp.read(filePath);
      } catch (error) {
          throw HttpError(400, "Failed to process image");
      }
    avatar.resize(250, 250).write(filePath);
    let resolvedPath = path.resolve("public/avatars", req.file.filename);
    try {
         await fs.rename(
           req.file.path,
           resolvedPath
      );
      resolvedPath = path.relative("public", resolvedPath);
      } catch (error) {
          return res.status(500).json({ message: "Failed to move image" });
      }

    const userAvatar = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: resolvedPath },
      { new: true }
    );
      if (userAvatar === null) {
        throw HttpError(400, "User not found");
    }
    res.status(200).json({ avatarURL: userAvatar.avatarURL });
      } catch (error) {
    next(error);
  }
}
export default { getAvatar, uploadAvatar };
