import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import HandleError from "../utils/handleError.js";
import tokenGenerator from "../utils/tokenGenerator.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    throw new HandleError("All fields are required.", 400);
  }

  // Check existing user
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new HandleError("User with this email already exists", 409);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is temp id",
      url: "This is temp url",
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = await tokenGenerator(user._id);

  // Remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User Registered Successfully.",
      user: createdUser,
    });
});

//Login user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new HandleError("Email and password cannot be empty.", 400);
  }

  // Finding user by email
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  //.select("+password") is used to explicitly include a field that is excluded by default (select: false) in the schema.

  if (!user) {
    throw new HandleError("Invalid Email or Password.", 401);
  }

  // Verify password
  const isPasswordValid = await user.verifyPassword(password);

  if (!isPasswordValid) {
    throw new HandleError("Invalid Email or Password.", 401);
  }

  // Generate tokens
  const { accessToken, refreshToken } = await tokenGenerator(user._id);

  // Remove password and refresh token from response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User Logged in Successfully.",
      user: loggedInUser,
    });
});

//Logout user
const logoutUser = asyncHandler(async (req, res) => {
  /*
   * Step 1: Validate authenticated user
   * - `req.user` is typically attached by authentication middleware
   * - If it does not exist, the request is unauthorized
   */
  if (!req.user?.id) {
    throw new HandleError("Unauthorized User.");
  }

  /*
   * Step 2: Remove refresh token from database
   * - `$unset` removes the field completely from the document
   * - This is a critical security step:
   *    → Prevents reuse of refresh token after logout
   *    → Ensures the user session is fully invalidated
   */
  await User.findByIdAndUpdate(req.user.id, {
    $unset: {
      refreshToken: 1,
    },
  });

  /*
   * Step 3: Define cookie options
   * - httpOnly → Prevents client-side JavaScript access (protects against XSS)
   * - secure → Ensures cookies are sent only over HTTPS in production
   * - sameSite → Protects against CSRF attacks
   */
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  /*
   * Step 4: Clear authentication cookies
   * - accessToken → Used for API authentication (short-lived)
   * - refreshToken → Used to generate new access tokens (long-lived)
   *
   * Using `clearCookie` is the recommended and cleaner approach
   */
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "Successfully Logged out.",
    });
});

export { registerUser, loginUser, logoutUser };
