import express from "express";
import {
  changeAvatar,
  verifyVerificationToken,
  requestVerificationToken,
} from "../controllers/usersControllers.js";
import uploadAvatar from "../middlewares/uploadAvatar.js";
import checkToken from "../middlewares/checkToken.js";
import { verificationTokenSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";

const router = express.Router();

router.patch(
  "/avatars",
  checkToken,
  uploadAvatar.single("avatar"),
  changeAvatar
);

router.get("/verify/:verificationToken", verifyVerificationToken);

router.post(
  "/verify",
  validateBody(verificationTokenSchema),
  requestVerificationToken
);

export default router;
