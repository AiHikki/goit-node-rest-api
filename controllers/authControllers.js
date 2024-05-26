import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import crypto from "node:crypto";
import { sendMail } from "../mail.js";

const register = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = crypto.randomUUID();

    await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    sendMail({
      to: email,
      from: "rmik9067@gmail.com",
      subject: "Please verify your email address",
      html: `
        <h1>Please verify your email address</h1>
        <p>Click this link to verify your email address</p>
        <a href="http://localhost:3000/users/verify/${verificationToken}">
          Verify</a>`,
      text: `
        Please verify your email address
        http://localhost:3000/users/verify/${verificationToken}`,
    });

    res.send({
      user: {
        email,
        subscription: subscription || "starter",
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Please verify your email address");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60,
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.send({
      token,
      user: {
        email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await User.findByIdAndUpdate(id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const changeSubscription = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { subscription } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { subscription },
      { new: true }
    );
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, getCurrentUser, changeSubscription };
