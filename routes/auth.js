import express from "express";
import { getCurrent, login, logout, register } from "../controllers/auth.js";
import { auth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", auth, logout);
authRouter.post("/current", auth, getCurrent);

export default authRouter;
