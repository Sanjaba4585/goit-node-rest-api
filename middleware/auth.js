import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/users.js";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (typeof authHeader === "undefined") {
    throw HttpError(401, "Not authorized");
  }
  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      throw HttpError(401, "Not authorized");
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    if (user.token !== token) {
      throw HttpError(401, "Not authorized");
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
  });
  next();
};
