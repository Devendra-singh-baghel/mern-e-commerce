import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { authorizeRoles, verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router(); //it will be creating new router object

//Routes

//Create Product
router
  .route("/products")
  .post(verifyUserAuth, authorizeRoles("admin"), createProduct);

//Get All Product
router.route("/products").get(getAllProducts);

//Get Single Product
router.route("/product/:id").get(getSingleProduct);

//Update Product
router
  .route("/product/:id")
  .patch(verifyUserAuth, authorizeRoles("admin"), updateProduct);

//Delete Product
router
  .route("/product/:id")
  .delete(verifyUserAuth, authorizeRoles("admin"), deleteProduct);

export default router;
