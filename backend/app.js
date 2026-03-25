import express from "express";
import product from "./routes/productRoutes.js";

const app = express();

app.use(express.json());

//Routes
app.use("/api/v1", product);

export default app;
