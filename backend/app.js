import express, { urlencoded } from "express";
import cors from "cors";
import errorHandleMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

//route imports
import user from "./routes/user.routes.js";
import product from "./routes/product.routes.js";
import order from "./routes/order.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./public/temp/" }));

//Routes
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);

app.use(errorHandleMiddleware);
export default app;
