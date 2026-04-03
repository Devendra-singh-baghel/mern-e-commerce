import express from "express";
import product from "./routes/product.routes.js";
import errorHandleMiddleware from "./middlewares/error.js";
import user from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

//Routes
app.use("/api/v1", product);
app.use("/api/v1", user);

app.use(errorHandleMiddleware);
export default app;
