import { getRazorpay } from "../config/razorpay.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";

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

//Payment Verification
const paymentVerification = asyncHandler(async (req, res) => {

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex")
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            reference: razorpay_payment_id
        });
    } else {
        return res.status(200).json({
            success: false,
            message: "Payment verification failed"
        });
    }

});

export { processPayment, sendAPIKey, paymentVerification };