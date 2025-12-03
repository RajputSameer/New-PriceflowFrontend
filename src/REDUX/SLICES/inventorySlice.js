
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch low stock products');
        }
    }
);

// Add Stock
export const addStock = createAsyncThunk(
    'inventory/addStock',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/inventory/${productId}/stock/add`, {
                quantity,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add stock');
        }
    }
);

// Remove Stock
export const removeStock = createAsyncThunk(
    'inventory/removeStock',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/inventory/${productId}/stock/remove`, {
                quantity,
            });
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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch movements');
        }
    }
);

// Get Inventory Analytics
export const getInventoryAnalytics = createAsyncThunk(
    'inventory/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/inventory');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

// Update Product Stock
export const updateProductStock = createAsyncThunk(
    'inventory/updateProductStock',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/inventory/${productId}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update stock');
        }
    }
);

// ============================================
// SLICE
// ============================================

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        inventory: [],
        selectedInventory: null,
        lowStockProducts: [],
        movements: [],
        analytics: null,
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setSelectedInventory: (state, action) => {
            state.selectedInventory = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ============ GET INVENTORY ============
        builder
            .addCase(getInventory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.inventory = action.payload.inventory || [];
            })
            .addCase(getInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET LOW STOCK PRODUCTS ============
        builder
            .addCase(getLowStockProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLowStockProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.lowStockProducts = action.payload.products || [];
            })
            .addCase(getLowStockProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ ADD STOCK ============
        builder
            .addCase(addStock.pending, (state) => {
                state.loading = true;
            })
            .addCase(addStock.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || 'Stock added successfully!';
            })
            .addCase(addStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ REMOVE STOCK ============
        builder
            .addCase(removeStock.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeStock.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || 'Stock removed successfully!';
            })
            .addCase(removeStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET STOCK MOVEMENTS ============
        builder
            .addCase(getStockMovements.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStockMovements.fulfilled, (state, action) => {
                state.loading = false;
                state.movements = action.payload.movements || [];
            })
            .addCase(getStockMovements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET INVENTORY ANALYTICS ============
        builder
            .addCase(getInventoryAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getInventoryAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.analytics = action.payload;
            })
            .addCase(getInventoryAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ UPDATE PRODUCT STOCK ============
        builder
            .addCase(updateProductStock.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProductStock.fulfilled, (state, action) => {
                state.loading = false;
                state.message = 'Inventory updated!';
            })
            .addCase(updateProductStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage, setSelectedInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
