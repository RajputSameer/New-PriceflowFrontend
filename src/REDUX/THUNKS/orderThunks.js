
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get All Orders
export const getOrders = createAsyncThunk(
    'order/getOrders',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/order', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// Get Order by ID
export const getOrderById = createAsyncThunk(
    'order/getOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/order/${orderId}`);
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

// Create Order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await api.post('/order', orderData);
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
    'order/updateOrderStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/order/${orderId}`, { status });
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order');
        }
    }
);

// Cancel Order
export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/order/${orderId}/cancel`);
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
        }
    }
);
