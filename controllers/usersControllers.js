import User from "../models/user.js";
import fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

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

export { changeAvatar };
