import express from "express";
import {
  getCurrent,
  login,
  logout,
  register,
  repeatEmail,
  verify,
} from "../controllers/auth.js";
import { auth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", auth, logout);
authRouter.post("/current", auth, getCurrent);
authRouter.get("/verify/:verificationToken", verify);
authRouter.post("/verify", repeatEmail);

export default authRouter;
