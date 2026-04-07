import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
} from "../controller/user.controller.js";
import { verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyUserAuth, logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/update").post(verifyUserAuth, updatePassword);
router.route("/profile").get(verifyUserAuth, getUserDetails);

export default router;
