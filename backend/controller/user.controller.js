import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import HandleError from "../utils/handleError.js";
import tokenGenerator from "../utils/tokenGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";

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

//Reset password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HandleError("User doesn't exist.", 400);
  }

  let resetToken;
  try {
    //Generate reset token and save to DB
    resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    throw new HandleError(
      "Could not save reset token, please try again later",
      500,
    );
  }

  // Create reset URL (frontend route)
  const resetPasswordURL = `${process.env.FRONTEND_URL}/password/forgot/${resetToken}`;

  //Create email message
  const message = `
  You requested a password reset.

  Please click the link below to reset your password:
  ${resetPasswordURL}

  This link will expire in 15 minutes.

  If you did not request this, please ignore this email.
  `;

  try {
    //Send email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request.",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email is sent to ${user.email} successfully.`,
    });
  } catch (error) {
    //Rollback token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new HandleError(
      "Email couldn't be sent, please try again later",
      500,
    );
  }
});

export { registerUser, loginUser, logoutUser, forgotPassword };
