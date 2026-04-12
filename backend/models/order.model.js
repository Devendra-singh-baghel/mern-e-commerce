import mongoose from "mongoose";
import { type } from "os";

const orderSchema = mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
    },

    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Card", "UPI"],
    },

    paidAt: {
      type: Date,
      // required: true,
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    orderStatus: {
      type: String,
      required: true,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    shippedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
