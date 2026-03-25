import { Product } from "../models/productModel.js";

const getAllProducts = (req, res) => {
  res.status(200).json({
    message: "All Products",
  });
};

const getSingleProduct = (req, res) => {
  res.status(200).json({
    message: "Single Product",
  });
};

export { getAllProducts, getSingleProduct };
