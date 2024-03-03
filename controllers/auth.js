import HttpError from "../helpers/HttpError.js";
import { User } from "../models/users.js";
import { registerSchema } from "../schemas/userSchema.js";
import "dotenv/config";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    const { error } = registerSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      email: normalizedEmail,
      password: hashPassword,
    });

    res.status(201).json({
      password: newUser.password,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }
    res.status(200).json({ token: user.token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
