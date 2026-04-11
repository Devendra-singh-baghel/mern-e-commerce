import express from "express";
import { authorizeRoles, verifyUserAuth } from "../middlewares/userAuth.js";
import { createNewOrder } from "../controller/order.controller.js";

const router = express.Router();

//Create New Order
router.route("/new/order").post(verifyUserAuth, createNewOrder);

export default router;
