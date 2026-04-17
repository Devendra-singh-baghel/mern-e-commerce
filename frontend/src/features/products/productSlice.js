import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Get all products (thunk)
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword }, { rejectWithValue }) => {
    try {
      const url = keyword
        ? `/api/v1/products?keyword=${encodeURIComponent(keyword)}`
        : `/api/v1/products`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  },
);

//Get product details (thunk)
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const url = `/api/v1/product/${id}`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: [],
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    //Get all products (lifecycle)
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.products = [];
      });

    //Get product details (lifecycle)
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;
