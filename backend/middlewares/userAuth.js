import asyncHandler from "../utils/asyncHandler.js";
import HandleError from "../utils/handleError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyUserAuth = asyncHandler(async (req, res, next) => {
  /*
   * STEP 1: Extract token from request
   * - First try to get token from cookies (browser-based auth)
   * - If not found, check Authorization header (for APIs/Postman/mobile apps)
   */
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  //STEP 2: If no token found, user is not authenticated
  if (!token) {
    throw new HandleError("Authentication missing! Please login.", 401);
  }

  let decodedData;

  try {
    /*
     * STEP 3: Verify JWT token
     * - Checks if token is valid (not tampered)
     * - Checks if token is expired
     * - Decodes payload (e.g. user id)
     */
    decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new HandleError("Invalid or expired access token", 401);
  }

  /*
   * STEP 4: Fetch user from database using decoded token data
   * - Even if token is valid, user might be deleted or inactive
   * - So always verify user existence in DB
   */
  const user = await User.findById(decodedData.id).select("-password");

  if (!user) {
    throw new HandleError("User not found", 401);
  }

  /*
   * STEP 5: Attach user object to request
   * - This allows next controllers/middlewares to access user info
   * - Example: req.user.id, req.user.email
   */
  req.user = user;
  next();
});

export { verifyUserAuth };
