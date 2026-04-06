import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
} from "../controller/user.controller.js";
import { verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyUserAuth, logoutUser);
router.route("/password/forgot").post(forgotPassword);

export default router;
