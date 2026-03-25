import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });
//Environment variables should always be imported at the top, because if `process.env` is used in `app.js` or `db.js`, it could be undefined.

import app from "./app.js";
import { connectMongoDatabase } from "./config/db.js";

//Global error handler: handle uncaught exception errors
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongoDatabase();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Server start failed:", error.message);
    process.exit(1); //Exit if connection is failed
  }
};

startServer();

// Global error handler: handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err.message);
  process.exit(1);
});
