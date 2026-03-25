import express from "express";
import {
  getAllProducts,
  getSingleProduct,
} from "../controller/productController.js";

const router = express.Router(); //it will be creating new router object

//Routes
router.route("/products").get(getAllProducts);
router.route("/product").get(getSingleProduct);

export default router;
