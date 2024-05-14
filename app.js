import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "./db.js"

import contactsRouter from "./routes/contactsRouter.js";
// const DB_URI = process.env.DB_URI;


// async function run() {
//   try {
//     await mongoose.connect(DB_URI)
//    // await mongoose.connection.db.admin().command({ ping: 1 })
//     console.info("Database is connected successfully");
//   } finally {
//     await mongoose.disconnect()
//   }
// }
// run().catch(error=>console.error(error))

//mongoose.connect()

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

 app.use(contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(8080, () => {
  console.log("Server is running. Use our API on port: 8080");
});
