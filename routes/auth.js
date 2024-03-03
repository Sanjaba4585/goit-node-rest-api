import express from "express";
import { login, register } from "../controllers/auth.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema } from "../schemas/userSchema.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", login);
export default authRouter;
