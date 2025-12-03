
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get All Products
export const getProducts = createAsyncThunk(
    'product/getProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/product', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

// Get Product by ID
export const getProductById = createAsyncThunk(
    'product/getProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/product/${productId}`);
            return response.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

// Get Top Products
export const getTopProducts = createAsyncThunk(
    'product/getTopProducts',
    async (limit = 10, { rejectWithValue }) => {
        try {
            const response = await api.get(`/product/top?limit=${limit}`);
            return response.data.topProducts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch top products');
        }
    }
);

// Create Product
export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await api.post('/product', productData);
            return response.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create product');
        }
    }
);

// Update Product
export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/product/${productId}`, data);
            return response.data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update product');
        }
    }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`/product/${productId}`);
            return productId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
        }
    }
);

// Search Products
export const searchProducts = createAsyncThunk(
    'product/searchProducts',
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.get(`/product/search?q=${query}`);
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);
