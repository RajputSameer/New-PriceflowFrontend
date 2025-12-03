
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get Payment Methods
export const getPaymentMethods = createAsyncThunk(
    'payment/getMethods',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payment/methods');
            return response.data.methods;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment methods');
        }
    }
);

// Get Payments
export const getPayments = createAsyncThunk(
    'payment/getPayments',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/payment/my-payments/list', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
        }
    }
);

// Initiate Payment
export const initiatePayment = createAsyncThunk(
    'payment/initiatePayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await api.post('/payment', paymentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to initiate payment');
        }
    }
);

// Create Payment Intent
export const createPaymentIntent = createAsyncThunk(
    'payment/createIntent',
    async (intentData, { rejectWithValue }) => {
        try {
            const response = await api.post('/payment/intent/create', intentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
        }
    }
);

// Verify Payment
export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async ({ paymentId, data }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/payment/${paymentId}/verify`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
        }
    }
);

// Get Payment Status
export const getPaymentStatus = createAsyncThunk(
    'payment/getStatus',
    async (paymentId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/payment/${paymentId}/status`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment status');
        }
    }
);
