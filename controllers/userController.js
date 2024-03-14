import path from "node:path";
import { User } from "../models/users.js";
import * as fs from "node:fs/promises";

export const uploadAvatar = async (req, res, next) => {
  try {
    await fs.rename(
      req.file.path,
      path.join(process.cwd(), "public/avatars", req.file.filename)
    );
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarURL: req.file.filename },
      { new: true }
    );
    if (!user) {
      throw HttpError(404, "Not found");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};
