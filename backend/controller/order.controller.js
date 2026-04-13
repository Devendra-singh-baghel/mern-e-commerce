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
    message: "Order Created Successfully.",
    order,
  });
});

//Getting Single Order
const getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    throw new HandleError("Order not found", 404);
  }

  /*
   * Authorization Check
   * - User can access only their own order
   * - Admin can access any order
   */
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new HandleError("You are not authorized to view this order", 403);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Geeting All My Orders
const getAllMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    message:
      orders.length === 0 ? "No orders found" : "Orders fetched successfully",
    orders,
  });
});

//Admin - Getting All Orders
const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();

  // Calculate total revenue
  const totalAmount = orders.reduce(
    (acc, order) => acc + (order.totalPrice || 0),
    0,
  );

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Update Order Status
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new HandleError("No order found", 404);
  }

  // Prevent updating already delivered order
  if (order.orderStatus === "Delivered") {
    throw new HandleError("Order already delivered", 400);
  }

  const status = req.body.status.toLowerCase();

  // Validate input
  if (!req.body.status) {
    throw new HandleError("Order status is required", 400);
  }

  // Update Status and Set shippedAt
  if (status === "shipped") {
    order.orderStatus = "Shipped";
    order.shippedAt = Date.now();
  }

  // Update Status and Set deliveredAt + paidAt (for COD)
  if (status === "delivered") {
    order.orderStatus = "Delivered";
    order.deliveredAt = Date.now();

    // If COD, payment happens at delivery
    if (order.paymentMethod === "COD") {
      // Update payment status
      order.paymentInfo.status = "completed";
      order.paidAt = Date.now();
    }
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

//Admin - Delete Order
const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new HandleError("No order found", 404);
  }

  // Prevent deleting Un delivered orders
  if (order.orderStatus !== "Delivered") {
    throw new HandleError(
      "This order is under processing and cannot be deleted",
      400,
    );
  }

  // Delete order
  await Order.deleteOne({ _id: order._id });

  res.status(200).json({
    success: true,
    message: "Order deleted successfully.",
  });
});

//Cancel order
const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new HandleError("No order found", 404);
  }

  if (order.orderStatus === "Delivered") {
    throw new HandleError("Delivered order cannot be cancelled", 400);
  }

  // Restore stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      await product.save({ validateBeforeSave: false });
    }
  }

  // Update status
  order.orderStatus = "Cancelled";

  // Update payment status
  order.paymentInfo.status = "failed";

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});

export {
  createNewOrder,
  getSingleOrder,
  getAllMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
};
