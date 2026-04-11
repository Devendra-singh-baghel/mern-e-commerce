import express from "express";
import errorHandleMiddleware from "./middlewares/error.js";
import user from "./routes/user.routes.js";
import product from "./routes/product.routes.js";
import order from "./routes/order.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

//Routes
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);

app.use(errorHandleMiddleware);
export default app;
