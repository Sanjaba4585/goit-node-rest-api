import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
import "dotenv/config";
import { configDotenv } from "dotenv";
import authRouter from "./routes/auth.js";
import { auth } from "./middleware/auth.js";
import userRouter from "./routes/userAvatarRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
configDotenv();
app.use("/api/contacts", auth, contactsRouter);
app.use("/users", authRouter, userRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

export default app;
