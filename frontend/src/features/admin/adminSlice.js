import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

// Fetch products for admin dashboard
export const fetchAdminProducts = createAsyncThunk(
    'admin/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/admin/products');
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while fetching products.",
            );
        }
    }
);

// Create new product
export const createProduct = createAsyncThunk(
    'admin/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post('/api/v1/admin/product/create', productData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while creating product.",
            );
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: [],
        success: false,
        loading: false,
        error: null,
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch admin products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch products.";
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.products.push(action.payload.product);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to create product.";
            });
    }
});

export const { removeError, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;
