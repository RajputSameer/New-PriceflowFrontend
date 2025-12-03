
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get All Categories
export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/category');
            return response.data.categories;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

// Get Category by ID
export const getCategoryById = createAsyncThunk(
    'category/getCategoryById',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/category/${categoryId}`);
            return response.data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
        }
    }
);

// Get Subcategories
export const getSubcategories = createAsyncThunk(
    'category/getSubcategories',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/category/${categoryId}/subcategories`);
            return response.data.subcategories;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subcategories');
        }
    }
);

// Create Category (Admin)
export const createCategory = createAsyncThunk(
    'category/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.post('/category', categoryData);
            return response.data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create category');
        }
    }
);

// Update Category (Admin)
export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ categoryId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/category/${categoryId}`, data);
            return response.data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

// Delete Category (Admin)
export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            await api.delete(`/category/${categoryId}`);
            return categoryId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

// Search Categories
export const searchCategories = createAsyncThunk(
    'category/searchCategories',
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.get(`/category/search/query?q=${query}`);
            return response.data.categories;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);
