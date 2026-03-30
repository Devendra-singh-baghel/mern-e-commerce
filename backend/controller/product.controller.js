import { Product } from "../models/product.model.js";
import HandleError from "../utils/handleError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";

//Create Products
const createProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product Created Successfully.",
    product,
  });
});

//Get All Products
const getAllProducts = asyncHandler(async (req, res, next) => {
  const apiFeature = new ApiFeatures(Product.find(), req.query).search();
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
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
const updateProducts = asyncHandler(async (req, res, next) => {
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
const deleteProducts = asyncHandler(async (req, res, next) => {
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
export {
  createProducts,
  getAllProducts,
  getSingleProduct,
  updateProducts,
  deleteProducts,
};
