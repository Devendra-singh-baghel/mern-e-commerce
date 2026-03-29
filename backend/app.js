import express from "express";
import product from "./routes/product.routes.js";
import errorHandleMiddleware from "./middlewares/error.js";

const app = express();

app.use(express.json({ limit: "16kb" }));

//Routes
app.use("/api/v1", product);

app.use(errorHandleMiddleware);
export default app;
