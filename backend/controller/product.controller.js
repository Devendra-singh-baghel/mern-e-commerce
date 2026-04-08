import { Product } from "../models/product.model.js";
import HandleError from "../utils/handleError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";

//Create Products
const createProduct = asyncHandler(async (req, res, next) => {
  /*
   * Prepare product data
   * - Avoid mutating req.body directly
   * - Attach user reference for ownership
   */
  const productData = {
    ...req.body,
    user: req.user.id,
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

//Update Products
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

//Delete Products
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

//
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
  updateProduct,
  deleteProduct,
  getAdminProducts,
};
