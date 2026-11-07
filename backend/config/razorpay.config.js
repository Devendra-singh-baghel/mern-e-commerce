import Razorpay from "razorpay";

let razorpayInstance = null;

const connectRazorpay = () => {
  const { RAZORPAY_API_KEY, RAZORPAY_API_SECRET } = process.env;

  if (!RAZORPAY_API_KEY || !RAZORPAY_API_SECRET) {
    throw new Error("Razorpay keys are missing in environment variables");
  }

  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_API_KEY,
    key_secret: RAZORPAY_API_SECRET,
  });

  console.log("Razorpay initialized successfully");
};

const getRazorpay = () => {
  if (!razorpayInstance) {
    throw new Error("Razorpay is not initialized. Call connectRazorpay() first");
  }
  return razorpayInstance;
};

export { connectRazorpay, getRazorpay };