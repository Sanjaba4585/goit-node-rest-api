import HttpError from "../helpers/HttpError.js";
import { User } from "../models/users.js";
import { registerSchema } from "../schemas/userSchema.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";

const { JWT_SECRET, BASE_URL } = process.env;
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    const { error } = registerSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const hashPassword = await bcrypt.hash(password, 10);

    transport.sendMail({
      to: email,
      from: "klo4585@gmail.com",
      subject: "Verify your email",
      html: `<a target ="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Verify your email</a>`,
    });
    const newUser = await User.create({
      ...req.body,
      verificationToken,
      email: normalizedEmail,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }
    if (user.verify === false) {
      throw HttpError(401, "Email not verified");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    if (!user) {
      throw HttpError(401, "Not Found");
    }
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken });
    if (user === null) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const repeatEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    transport.sendMail({
      to: email,
      from: "klo4585@gmail.com",
      subject: "Verify your email",
      html: `<a target ="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Verify your email</a>`,
    });
    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
