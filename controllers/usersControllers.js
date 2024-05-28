import User from "../models/user.js";
import fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import crypto from "node:crypto";
import HttpError from "../helpers/HttpError.js";
import { sendVerificationMail } from "../mail.js";

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "No file uploaded");
    }

    const tempPath = req.file.path;
    const targetPath = path.resolve("public/avatars", req.file.filename);

    // Resize the image using Jimp
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(targetPath);

    // Remove the temporary file after processing
    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user.id, { avatarURL }, { new: true });

    res.send({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

const verifyVerificationToken = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });

    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const requestVerificationToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    sendVerificationMail({
      to: email,
      verificationToken: user.verificationToken,
    });

    res.send({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

export { changeAvatar, verifyVerificationToken, requestVerificationToken };
