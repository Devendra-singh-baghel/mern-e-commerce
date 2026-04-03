import { User } from "../models/user.model.js";
import HandleError from "./handleError.js";

const tokenGenerator = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new HandleError(404, "User not found");
    }

    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new HandleError("Something went wrong while generating tokens", 500);
  }
};

export default tokenGenerator;
