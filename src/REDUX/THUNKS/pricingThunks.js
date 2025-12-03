
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get Pricing Strategies
export const getPricingStrategies = createAsyncThunk(
    'pricing/getStrategies',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/pricing', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch strategies');
        }
    }
);

// Create Pricing Strategy
export const createPricingStrategy = createAsyncThunk(
    'pricing/createStrategy',
    async (strategyData, { rejectWithValue }) => {
        try {
            const response = await api.post('/pricing', strategyData);
            return response.data.strategy;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create strategy');
        }
    }
);

// Update Pricing Strategy
export const updatePricingStrategy = createAsyncThunk(
    'pricing/updateStrategy',
    async ({ strategyId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/pricing/${strategyId}`, data);
            return response.data.strategy;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update strategy');
        }
    }
);

// Delete Pricing Strategy
export const deletePricingStrategy = createAsyncThunk(
    'pricing/deleteStrategy',
    async (strategyId, { rejectWithValue }) => {
        try {
            await api.delete(`/pricing/${strategyId}`);
            return strategyId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete strategy');
        }
    }
);

// Get Pricing Analytics
export const getPricingAnalytics = createAsyncThunk(
    'pricing/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/pricing');
            return response.data.pricingData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch pricing analytics');
        }
    }
);

// Calculate Price
export const calculatePrice = createAsyncThunk(
    'pricing/calculatePrice',
    async (priceData, { rejectWithValue }) => {
        try {
            const response = await api.post('/pricing/calculate', priceData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to calculate price');
        }
    }
);
