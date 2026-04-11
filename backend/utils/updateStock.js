import { Product } from "../models/product.model.js";
import HandleError from "./handleError.js";

const updateStock = async (orderItems) => {
  for (const item of orderItems) {
    // Find product from DB
    const product = await Product.findById(item.product);

    if (!product) {
      throw new HandleError("Product not found", 404);
    }

    // Check stock availability
    if (product.stock < item.quantity) {
      throw new HandleError(`${product.name} is out of stock.`, 400);
    }

    // Reduce stock
    product.stock -= item.quantity;

    // Save updated product
    await product.save({ validateBeforeSave: false });
    // validateBeforeSave false because we are only updating stock
  }
};

export default updateStock;
