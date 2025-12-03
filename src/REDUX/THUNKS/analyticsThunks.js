
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get Sales Analytics
export const getSalesAnalytics = createAsyncThunk(
    'analytics/getSalesAnalytics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/sales', { params });
            return response.data.analytics;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales analytics');
        }
    }
);

// Get Revenue Analytics
export const getRevenueAnalytics = createAsyncThunk(
    'analytics/getRevenueAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/revenue');
            return response.data.revenue;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue analytics');
        }
    }
);

// Get Profit Analytics
export const getProfitAnalytics = createAsyncThunk(
    'analytics/getProfitAnalytics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/profit', { params });
            return response.data.analytics;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profit analytics');
        }
    }
);

// Get Customer Analytics
export const getCustomerAnalytics = createAsyncThunk(
    'analytics/getCustomerAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/customers');
            return response.data.analytics;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer analytics');
        }
    }
);

// Get Inventory Analytics
export const getInventoryAnalytics = createAsyncThunk(
    'analytics/getInventoryAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/inventory');
            return response.data.analytics;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory analytics');
        }
    }
);

// Get Traffic Analytics
export const getTrafficAnalytics = createAsyncThunk(
    'analytics/getTrafficAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/traffic');
            return response.data.analytics;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch traffic analytics');
        }
    }
);

// Get Payment Analytics
export const getPaymentAnalytics = createAsyncThunk(
    'analytics/getPaymentAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/payments');
            return response.data.analytics;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment analytics');
        }
    }
);

// Get Summary Analytics
export const getSummaryAnalytics = createAsyncThunk(
    'analytics/getSummaryAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/summary');
            return response.data.summary;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary analytics');
        }
    }
);

// Get Top Products
export const getTopProductsAnalytics = createAsyncThunk(
    'analytics/getTopProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/products/top');
            return response.data.topProducts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch top products');
        }
    }
);

// Generate Report
export const generateAnalyticsReport = createAsyncThunk(
    'analytics/generateReport',
    async (dateRange, { rejectWithValue }) => {
        try {
            const response = await api.post('/analytics/report/generate', dateRange);
            return response.data.report;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
        }
    }
);
