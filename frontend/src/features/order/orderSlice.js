import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//Creating Order
export const createOrder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/new/order', order, config)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Order Creating Failed')
    }
})

//Get All Orders of User
export const getAllMyOrders = createAsyncThunk('order/getAllMyOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/orders/user');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        success: false,
        loading: false,
        error: null,
        orders: [],
        order: {}
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.order = action.payload.order;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Order Creating Failed';
            }),
            // Get All Orders of User
            builder
                .addCase(getAllMyOrders.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getAllMyOrders.fulfilled, (state, action) => {
                    state.loading = false;
                    state.success = action.payload.success;
                    state.orders = action.payload.orders;
                })
                .addCase(getAllMyOrders.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || 'Failed to fetch orders';
                });
    }
})

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
