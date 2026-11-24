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

// Get all users (Admin)
export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/admin/users');
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while fetching users.",
            );
        }
    }
);

// Get single user details (Admin)
export const getSingleUser = createAsyncThunk(
    'admin/getSingleUser',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/admin/user/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while fetching user details.",
            );
        }
    }
);

// Update user role (Admin)
export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(`/api/v1/admin/user/${id}`, { role });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while updating user role.",
            );
        }
    }
);

// Delete user (Admin)
export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
            return { id, ...data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while deleting user.",
            );
        }
    }
);

// Get all orders (Admin)
export const getAllOrders = createAsyncThunk(
    'admin/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/admin/orders');
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while fetching orders.",
            );
        }
    }
);

// Delete order (Admin)
export const deleteOrder = createAsyncThunk(
    'admin/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
            return { id, ...data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "An error occurred while deleting order.",
            );
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: [],
        product: {},
        users: [],
        singleUser: {},
        orders: [],
        totalAmount: 0,
        success: false,
        isUpdated: false,
        isDeleted: false,
        userUpdated: false,
        userDeleted: false,
        orderDeleted: false,
        deletingProductId: null,
        deletingUserId: null,
        deletingOrderId: null,
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
        },
        removeUserUpdated: (state) => {
            state.userUpdated = false;
            state.singleUser = {};
        },
        removeUserDeleted: (state) => {
            state.userDeleted = false;
        },
        removeOrderDeleted: (state) => {
            state.orderDeleted = false;
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
            })

            // Get all users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch users.";
            })

            // Get single user
            .addCase(getSingleUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.loading = false;
                state.singleUser = action.payload.user;
            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch user details.";
            })

            // Update user role
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.userUpdated = action.payload.success;
                state.singleUser = action.payload.user;
                if (state.users && state.users.length > 0) {
                    state.users = state.users.map((user) =>
                        user._id === action.payload.user?._id ? action.payload.user : user
                    );
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update user role.";
            })

            // Delete user
            .addCase(deleteUser.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.deletingUserId = action.meta.arg;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.deletingUserId = null;
                state.userDeleted = action.payload.success;
                state.users = state.users.filter(
                    (user) => user._id !== action.payload.id
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.deletingUserId = null;
                state.error = action.payload?.message || "Failed to delete user.";
            })

            // Get all orders (Admin)
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch orders.";
            })

            // Delete order (Admin)
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.deletingOrderId = action.meta.arg;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.deletingOrderId = null;
                state.orderDeleted = action.payload.success;
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload.id
                );
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.deletingOrderId = null;
                state.error = action.payload?.message || "Failed to delete order.";
            });
    }
});

export const {
    removeError,
    removeSuccess,
    removeUpdated,
    removeDeleted,
    removeUserUpdated,
    removeUserDeleted,
    removeOrderDeleted,
} = adminSlice.actions;

export default adminSlice.reducer;
