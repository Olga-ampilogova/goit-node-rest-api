import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
//import mongoose from "mongoose";
import "./db.js";
import contactsRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/auth.js";
import authMiddleWare from "./middleware/auth.js";
import path from "node:path";
import avatarRouter from "./routes/usersRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", authMiddleWare, contactsRouter);
app.use("/users", userRouter);
app.use("/users/avatars", express.static(path.resolve("public/avatars")));
app.use("/users", avatarRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
const Port = process.env.Port || 8080;

app.listen(Port, () => {
  console.log(`Server is running. Use our API on port:${Port}`);
});
