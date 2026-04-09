import { Product } from "../models/product.model.js";
import HandleError from "../utils/handleError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";

//Admin - Create Products
const createProduct = asyncHandler(async (req, res, next) => {
  /*
   * Prepare product data
   * - Avoid mutating req.body directly
   * - Attach user reference for ownership
   */
  const productData = {
    ...req.body,
    createdBy: req.user.id,
  };

  /*
   * Create product in database
   */
  const product = await Product.create(productData);

  /*
   * Send response with created product
   */
  res.status(201).json({
    success: true,
    message: "Product Created Successfully.",
    product,
  });
});

//Get All Products
const getAllProducts = asyncHandler(async (req, res, next) => {
  const resultsPerPage = Math.max(1, Number(req.query.limit) || 10);

  // Ensure current page is always >= 1
  const page = Math.max(1, Number(req.query.page) || 1);

  // Apply search and filter before pagination
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort();

  // Clone the query BEFORE applying pagination
  // This is important because we need total count of filtered results
  // without pagination affecting it
  const filteredQuery = apiFeature.query.clone();

  const productCount = await filteredQuery.countDocuments();

  const totalPages = Math.ceil(productCount / resultsPerPage);

  // Handle case where requested page exceeds available pages
  // Also check productCount > 0 to avoid unnecessary error when no data exists
  if (page > totalPages && productCount > 0) {
    throw new HandleError("This page doesn't exist", 404);
  }

  // Apply pagination AFTER counting documents
  apiFeature.pagination(resultsPerPage);

  // Execute final query (with search, filter, and pagination applied)
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultsPerPage,
    totalPages,
    currentPage: page,
  });
});

//Get Single Products
const getSingleProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    throw new HandleError("Product Not Found.", 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Creating and Updating Review
const createReviewForProduct = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  // 1. Validate input
  if (!rating || !comment) {
    throw new HandleError("Rating and comment are required", 400);
  }

  if (rating < 1 || rating > 5) {
    throw new HandleError("Rating must be between 1 and 5", 400);
  }

  // 2. Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new HandleError("Product not found", 404);
  }

  // 3. Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id,
  );

  if (alreadyReviewed) {
    // 4. Update existing review
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id) {
        rev.rating = Number(rating);
        rev.comment = comment;
      }
    });
  } else {
    // 5. Add new review
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
  }

  // 6. Update total reviews count
  product.numOfReviews = product.reviews.length;

  // 7. Recalculate average rating
  product.avgRatings =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.reviews.length;

  // 8. Save product
  await product.save();

  // 9. Send response
  res.status(200).json({
    success: true,
    product,
  });
});

//Get Product Reviews
const getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new HandleError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    totalReviews: product.numOfReviews,
    avgRatings: product.avgRatings,
    reviews: product.reviews,
  });
});

//Deleting Review
const deleteReview = asyncHandler(async (req, res, next) => {
  const { productId, reviewId } = req.params;

  // 1. Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new HandleError("Product not found", 404);
  }

  // 2. Check if review exists
  const reviewExists = product.reviews.some(
    (rev) => rev._id.toString() === reviewId,
  );

  if (!reviewExists) {
    throw new HandleError("Review not found", 404);
  }

  // 3. Remove review
  product.reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId,
  );

  // 4. Update total reviews
  product.numOfReviews = product.reviews.length;

  // 5. Recalculate average rating
  product.avgRatings =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.reviews.length;

  // 6. Save updated product
  await product.save();

  // 7. Send response
  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

//Admin - Update Products
const updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findByIdAndUpdate(id, req.body, {
    // new:true   // return updated document but deprecated in newer versions of Mongoose.
    // returnDocument: "before", // return old document (before update)
    returnDocument: "after", // return updated document (after update)
    runValidators: true, // ensures schema validations are applied during update operations
  });

  if (!product) {
    throw new HandleError("Product Not Found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully.",
    product,
  });
});

//Admin - Delete Products
const deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new HandleError("Product Not Found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully.",
    product,
  });
});

//Admin - Get all product by admin
const getAdminProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  const totalProducts = products.length;

  res.status(200).json({
    success: true,
    totalProducts,
    products,
  });
});

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  createReviewForProduct,
  getProductReviews,
  deleteReview,
  updateProduct,
  deleteProduct,
  getAdminProducts,
};
