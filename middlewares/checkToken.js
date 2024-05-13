import User from "../models/user.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

const checkToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    throw HttpError(401, "Not authorized");
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    if (user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = {
      id: user._id,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default checkToken;
