import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      trim: true,
      maxLength: [25, "Name must be less than 25 characters"],
      minLength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      lowercase: true,
      unique: true,
      index: true,
      validate: [validator.isEmail, "Please Enter Valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password Should be Greater than 8 Characters"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

// Password hashing middleware
// Using function keyword because arrow functions don't have their own `this`
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  // This prevents re-hashing the already hashed password when updating other fields
  if (!this.isModified("password")) {
    return;
  }

  // Hash the password before saving to database
  this.password = await bcrypt.hash(this.password, 10);
});

//Comparing original password and hashed password
userSchema.methods.verifyPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

//Generate access token
userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRY,
    },
  );
};

//Generate refresh token
userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

//Generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  /*
   * Step 1: Generate a random reset token
   * - crypto.randomBytes creates a secure random buffer
   * - Converted to hex string for easy sharing via URL/email
   */
  const resetToken = crypto.randomBytes(20).toString("hex");

  /*
   * Step 2: Hash the token before saving to database
   * - Using SHA-256 hashing algorithm
   * - We store the hashed token instead of the raw token for security
   * - Even if the database is compromised, the original token cannot be used
   */
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  /*
   * Step 3: Set token expiration time
   * - Token will expire after 15 minutes
   * - Helps prevent misuse of old tokens
   */
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  /*
   * Step 4: Return the raw token
   */
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
