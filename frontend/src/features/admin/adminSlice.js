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

// Create new product (Admin)
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

// Update product (Admin)
export const updateProduct = createAsyncThunk(
    'admin/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.patch(`/api/v1/admin/product/${id}`, productData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while updating product.",
            );
        }
    }
);

// Delete product (Admin)
export const deleteProduct = createAsyncThunk(
    'admin/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/product/${id}`);
            return { id, ...data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while deleting product.",
            );
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: [],
        product: {},
        success: false,
        isUpdated: false,
        isDeleted: false,
        deletingProductId: null,
        loading: false,
        error: null,
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
        removeUpdated: (state) => {
            state.isUpdated = false;
        },
        removeDeleted: (state) => {
            state.isDeleted = false;
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
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdated = action.payload.success;
                state.product = action.payload.product;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update product.";
            })

            // Delete product
            .addCase(deleteProduct.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.deletingProductId = action.meta.arg;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.deletingProductId = null;
                state.isDeleted = action.payload.success;
                state.products = state.products.filter(
                    (product) => product._id !== action.payload.id
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.deletingProductId = null;
                state.error = action.payload?.message || "Failed to delete product.";
            });
    }
});

export const { removeError, removeSuccess, removeUpdated, removeDeleted } = adminSlice.actions;
export default adminSlice.reducer;
