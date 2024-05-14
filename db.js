import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

// async function run() {
//   try {
//     await mongoose.connect(DB_URI);
//     // await mongoose.connection.db.admin().command({ ping: 1 })
//     console.info("Database is connected successfully");
//   } finally {
//     await mongoose.disconnect();
//   }
// }
// run().catch((error) => console.error(error));
mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
