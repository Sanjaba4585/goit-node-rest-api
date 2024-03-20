import path from "node:path";
import { User } from "../models/users.js";
import * as fs from "node:fs/promises";
import Jimp from "jimp";

const avatarDir = path.resolve("public", "avatars");
export const uploadAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!req.file) {
      throw HttpError(400, "Please, attach avatar.It is required");
    }
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.resolve(avatarDir, filename);

    const image = await Jimp.read(tempUpload);
    image.resize(250, 250).write(tempUpload);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

// export const uploadAvatar = async (req, res, next) => {
//   try {
//     await fs.rename(
//       req.file.path,
//       path.join(process.cwd(), "public/avatars", req.file.filename)
//     );
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { avatarURL: req.file.filename },
//       { new: true }
//     );
//     if (!user) {
//       throw HttpError(404, "Not found");
//     }
//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// };
