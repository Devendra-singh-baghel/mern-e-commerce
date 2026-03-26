import { Product } from "../models/product.model.js";

//Create Products
const createProducts = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product Created Successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Single Products
const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Products
const updateProducts = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      // new:true   // return updated document but deprecated in newer versions of Mongoose.
      // returnDocument: "before", // return old document (before update)
      returnDocument: "after", // return updated document (after update)
      runValidators: true, // ensures schema validations are applied during update operations
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete Products
const deleteProducts = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export {
  createProducts,
  getAllProducts,
  getSingleProduct,
  updateProducts,
  deleteProducts,
};
