import express from "express";
import { uploadAvatar } from "../controllers/userController.js";
import upload from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.patch("/avatar", auth, upload.single("avatar"), uploadAvatar);

export default userRouter;
