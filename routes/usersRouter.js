import express from "express";
import { changeAvatar } from "../controllers/usersControllers.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";

const router = express.Router();

router.patch("/avatars", uploadAvatar.single("avatar"), changeAvatar);

export default router;
