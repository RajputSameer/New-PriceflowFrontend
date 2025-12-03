
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get Active Discounts
export const getActiveDiscounts = createAsyncThunk(
    'discount/getActive',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/discount/active');
            return response.data.discounts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch discounts');
        }
    }
);

// Get Discounts (User)
export const getDiscounts = createAsyncThunk(
    'discount/getDiscounts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/discount/my-discounts/list', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch discounts');
        }
    }
);

// Create Discount
export const createDiscount = createAsyncThunk(
    'discount/createDiscount',
    async (discountData, { rejectWithValue }) => {
        try {
            const response = await api.post('/discount', discountData);
            return response.data.discount;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create discount');
        }
    }
);

// Update Discount
export const updateDiscount = createAsyncThunk(
    'discount/updateDiscount',
    async ({ discountId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/discount/${discountId}`, data);
            return response.data.discount;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update discount');
        }
    }
);

// Delete Discount
export const deleteDiscount = createAsyncThunk(
    'discount/deleteDiscount',
    async (discountId, { rejectWithValue }) => {
        try {
            await api.delete(`/discount/${discountId}`);
            return discountId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete discount');
        }
    }
);

// Validate Discount Code
export const validateDiscountCode = createAsyncThunk(
    'discount/validateCode',
    async ({ code, cartValue }, { rejectWithValue }) => {
        try {
            const response = await api.post('/discount/validate', { code, cartValue });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Invalid discount code');
        }
    }
);

// Get Discount Stats
export const getDiscountStats = createAsyncThunk(
    'discount/getStats',
    async (discountId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/discount/${discountId}/stats`);
            return response.data.stats;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);
