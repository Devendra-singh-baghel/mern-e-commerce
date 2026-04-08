import express from "express";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { authorizeRoles, verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router(); //it will be creating new router object

//Routes

//Get All Product
router.route("/products").get(getAllProducts);

//Get Single Product
router.route("/product/:id").get(getSingleProduct);

/************************************ X ********************************/
//Admin Routes

//Create Product
router
  .route("/admin/product/create")
  .post(verifyUserAuth, authorizeRoles("admin"), createProduct);

//Get All Product By Admin
router
  .route("/admin/products")
  .get(verifyUserAuth, authorizeRoles("admin"), getAdminProducts);

//Update Product
router
  .route("/admin/product/:id")
  .patch(verifyUserAuth, authorizeRoles("admin"), updateProduct);

//Delete Product
router
  .route("/admin/product/:id")
  .delete(verifyUserAuth, authorizeRoles("admin"), deleteProduct);

export default router;
