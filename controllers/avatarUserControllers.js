import { User } from "../models/users.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import { fileURLToPath } from "node:url";
import mail from "../mail.js";

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
      throw HttpError(400, "No file uploaded");
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
      await fs.rename(req.file.path, resolvedPath);
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

async function verify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const userVerified = await User.findOne({
      verificationToken: verificationToken,
    });
    if (userVerified === null) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(userVerified._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function verifyConfirmation(req, res, next) {
  const { email } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  try {
    const userVerified = await User.findOne({ email });
    if (!userVerified) {
      throw HttpError(400, "The user not found");
    }
    if (userVerified.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const verifyToken = userVerified.verificationToken;
    await mail.sendEmail({
      to: lowerCaseEmail,
      from: "ampilogovaolga71@gmail.com",
      subject: "Welcome to contacts",
      html: `To confirm your email click  on the <a href= "http://localhost:8080/users/verify/${verifyToken}">link</a>`,
      text: `To confirm your email open the link ${verifyToken}`,
    });
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}
export default { getAvatar, uploadAvatar, verify, verifyConfirmation };
