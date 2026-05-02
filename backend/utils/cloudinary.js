import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//Upload on cloudinary
const uploadOnCloudinary = async (localFilePath, options = {}) => {
  // If file does not exist, return null.
  if (!localFilePath || !fs.existsSync(localFilePath)) return null;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // image, video, pdf handle all types
      ...options, // folder, width, crop etc. pass externally
    });

    // Upload successful - delete temp file
    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    // Upload failed - also delete temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

//Delete from cloudinary
const deleteFromCloudinary = async (publicId) => {
  // If no publicId provided, skip
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return result; // { result: "ok" } or "not found"
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
