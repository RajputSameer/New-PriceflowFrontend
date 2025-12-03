
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get Inventory
export const getInventory = createAsyncThunk(
    'inventory/getInventory',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
        }
    }
);

// Get Low Stock Products
export const getLowStockProducts = createAsyncThunk(
    'inventory/getLowStock',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/admin/inventory/low-stock');
            return response.data.products;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch low stock products');
        }
    }
);

// Add Stock
export const addStock = createAsyncThunk(
    'inventory/addStock',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/inventory/${productId}/stock/add`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add stock');
        }
    }
);

// Remove Stock
export const removeStock = createAsyncThunk(
    'inventory/removeStock',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/inventory/${productId}/stock/remove`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove stock');
        }
    }
);

// Get Stock Movements
export const getStockMovements = createAsyncThunk(
    'inventory/getMovements',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/${productId}/movements`);
            return response.data.movements;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch movements');
        }
    }
);
