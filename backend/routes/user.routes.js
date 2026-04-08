import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controller/user.controller.js";
import { authorizeRoles, verifyUserAuth } from "../middlewares/userAuth.js";

const router = express.Router();

//Register user
router.route("/register").post(registerUser);

//Login user
router.route("/login").post(loginUser);

//Logout user
router.route("/logout").post(verifyUserAuth, logoutUser);

//Forgot password
router.route("/password/forgot").post(forgotPassword);

//Reset password
router.route("/password/reset/:token").post(resetPassword);

//Update password
router.route("/password/update").post(verifyUserAuth, updatePassword);

//User profile
router.route("/profile").get(verifyUserAuth, getUserDetails);

//Update user profile
router.route("/profile/update").patch(verifyUserAuth, updateUserProfile);

//Admin Routes
//Get all users
router
  .route("/admin/users")
  .get(verifyUserAuth, authorizeRoles("admin"), getAllUsers);

//Get single user
router
  .route("/admin/user/:id")
  .get(verifyUserAuth, authorizeRoles("admin"), getSingleUser);

//Update user role
router
  .route("/admin/user/:id")
  .patch(verifyUserAuth, authorizeRoles("admin"), updateUserRole);

//Delete user
router
  .route("/admin/user/:id")
  .delete(verifyUserAuth, authorizeRoles("admin"), deleteUser);

export default router;
