import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  changeSubscription,
} from "../controllers/authControllers.js";
import { userSchema, subscriptionSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import checkToken from "../middlewares/checkToken.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSchema), register);

authRouter.post("/login", validateBody(userSchema), login);

authRouter.get("/logout", checkToken, logout);

authRouter.get("/current", checkToken, getCurrentUser);

authRouter.patch(
  "",
  checkToken,
  validateBody(subscriptionSchema),
  changeSubscription
);

export default authRouter;
