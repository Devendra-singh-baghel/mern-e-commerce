import express from "express";
import { authorizeRoles, verifyUserAuth } from "../middlewares/userAuth.js";
import {
  createNewOrder,
  getAllMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controller/order.controller.js";

const router = express.Router();

//Create New Order
router.route("/new/order").post(verifyUserAuth, createNewOrder);

//Getting Single Order (User + Admin both)
router.route("/order/:id").get(verifyUserAuth, getSingleOrder);

//Getting All My Orders
router.route("/orders/me").get(verifyUserAuth, getAllMyOrders);

//Admin - Getting All Orders
router
  .route("/admin/orders")
  .get(verifyUserAuth, authorizeRoles("admin"), getAllOrders);

//Admin - Update Order Status
router
  .route("/admin/order/:id")
  .patch(verifyUserAuth, authorizeRoles("admin"), updateOrderStatus);

export default router;
