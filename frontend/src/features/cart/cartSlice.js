import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Add items to cart API
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return {
        product_id: data.product._id,
        name: data.product.name,
        price: data.product.price,
        stock: data.product.stock,
        image: data.product.image[0]?.url,
        quantity,
        success: data.success,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "An Error Occurred.");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    success: null,
    message: null,
    removingId: null,
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
    removeItemFromCart: (state, action) => {
      state.removingId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product_id !== action.payload,
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.removingId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const item = action.payload;

        const existingItem = state.cartItems.find(
          (i) => i.product_id === item.product_id,
        );

        if (existingItem) {
          existingItem.quantity = item.quantity;
        } else {
          state.cartItems.push(item);
        }

        state.success = action.payload?.success;
        state.message = `${item.name} added to cart`;

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred";
      });
  },
});

export const {
  removeErrors,
  removeSuccess,
  removeMessage,
  removeItemFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
