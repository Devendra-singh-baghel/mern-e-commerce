import { getRazorpay } from "../config/razorpay.config.js";
import asyncHandler from "../utils/asyncHandler.js";

const processPayment = asyncHandler(async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });
});

//Send API Key
const sendAPIKey = asyncHandler(async (req, res) => {

    res.status(200).json({
        key: process.env.RAZORPAY_API_KEY
    });
});

export { processPayment, sendAPIKey };