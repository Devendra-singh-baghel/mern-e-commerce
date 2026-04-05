import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name."],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Please Enter Product Description."],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Please Enter Product Price."],
      maxLength: [7, "Price Cannot Execeed 7 Digits."],
    },

    ratings: {
      type: Number,
      default: 0,
    },

    image: [
      {
        public_id: {
          type: String,
          required: true,
        },

        url: {
          type: String,
          required: true,
        },
      },
    ],

    category: {
      type: String,
      required: [true, "Please Enter Product Category."],
      trim: true,
    },

    stock: {
      type: Number,
      required: [true, "Please Enter Product Stock."],
      maxLength: [5, "Stock Cannot Execeed 5 Digits."],
      default: 1,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        rating: {
          type: Number,
          required: true,
        },

        comment: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
