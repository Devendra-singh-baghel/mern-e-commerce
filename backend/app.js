import express, { urlencoded } from "express";
import cors from "cors";
import errorHandleMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

//route imports
import user from "./routes/user.routes.js";
import product from "./routes/product.routes.js";
import order from "./routes/order.routes.js";
import payment from "./routes/payment.routes.js";

const app = express();

// Liveness check: Used by the uptime monitor / keep-alive cron job.
app.get("/health", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./public/temp/" }));

//Routes
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(errorHandleMiddleware);
export default app;
