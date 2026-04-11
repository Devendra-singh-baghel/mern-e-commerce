import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import HandleError from "../utils/handleError.js";
import updateStock from "../utils/updateStock.js";

//Create New Order
const createNewOrder = asyncHandler(async (req, res, next) => {
  /*
  * Complete flow - 
    User → Order place
     → Backend validates
     → Check stock
     → Price calculate
     → Order create
     → Stock reduce
     → Response send
    */
  const { shippingInfo, orderItems, paymentMethod, paymentInfo } = req.body;

  // 1. Validate order items
  if (!orderItems || orderItems.length === 0) {
    throw new HandleError("No order items provided", 400);
  }

  // 2. Check stock and Calculate price on backend - Never trust frontend price
  let itemsPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new HandleError("Product not found", 404);
    }

    // Stock check BEFORE order creation
    if (product.stock < item.quantity) {
      throw new HandleError(`${product.name} is out of stock`, 400);
    }

    // Calculate price using DB price (not frontend price)
    itemsPrice += product.price * item.quantity;
  }

  // 3. Calculate tax & shipping
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // 18% GST
  const shippingPrice = itemsPrice > 500 ? 0 : 50;

  // 4. Total price
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Create order (only after validation)
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,

    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,

    // Set paidAt only for successful online payments
    paidAt:
      paymentMethod !== "COD" && paymentInfo?.status === "completed"
        ? Date.now()
        : null,

    user: req.user._id,
  });

  // 6. Update stock AFTER order creation
  await updateStock(orderItems);

  // 7. Response
  res.status(201).json({
    success: true,
    order,
  });
});

export { createNewOrder };
