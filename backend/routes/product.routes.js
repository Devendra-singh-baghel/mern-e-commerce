import express from "express";
import {
  createProducts,
  deleteProducts,
  getAllProducts,
  getSingleProduct,
  updateProducts,
} from "../controller/product.controller.js";

const router = express.Router(); //it will be creating new router object

//Routes
router.route("/products").post(createProducts);
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/product/:id").patch(updateProducts);
router.route("/product/:id").delete(deleteProducts);

export default router;
