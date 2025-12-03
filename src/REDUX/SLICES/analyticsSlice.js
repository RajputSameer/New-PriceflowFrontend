
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

// Get Sales Analytics
export const getSalesAnalytics = createAsyncThunk(
    'analytics/getSalesAnalytics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/sales', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales analytics');
        }
    }
);

// Get Revenue Analytics
export const getRevenueAnalytics = createAsyncThunk(
    'analytics/getRevenueAnalytics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/revenue', { params });
            return response.data;
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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profit analytics');
        }
    }
);

// Get Customer Analytics
export const getCustomerAnalytics = createAsyncThunk(
    'analytics/getCustomerAnalytics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/customers', { params });
            return response.data;
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
            return response.data;
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
            return response.data;
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
            return response.data;
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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary analytics');
        }
    }
);

// Get Top Products
export const getTopProductsAnalytics = createAsyncThunk(
    'analytics/getTopProducts',
    async (limit = 10, { rejectWithValue }) => {
        try {
            const response = await api.get(`/analytics/products/top?limit=${limit}`);
            return response.data;
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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
        }
    }
);

// ============================================
// SLICE
// ============================================

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        salesAnalytics: null,
        revenueAnalytics: null,
        profitAnalytics: null,
        customerAnalytics: null,
        inventoryAnalytics: null,
        trafficAnalytics: null,
        paymentAnalytics: null,
        summaryAnalytics: null,
        topProducts: [],
        report: null,
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
    },
    extraReducers: (builder) => {
        // ============ GET SALES ANALYTICS ============
        builder
            .addCase(getSalesAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSalesAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.salesAnalytics = action.payload;
            })
            .addCase(getSalesAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET REVENUE ANALYTICS ============
        builder
            .addCase(getRevenueAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRevenueAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueAnalytics = action.payload;
            })
            .addCase(getRevenueAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET PROFIT ANALYTICS ============
        builder
            .addCase(getProfitAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProfitAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.profitAnalytics = action.payload;
            })
            .addCase(getProfitAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET CUSTOMER ANALYTICS ============
        builder
            .addCase(getCustomerAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCustomerAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.customerAnalytics = action.payload;
            })
            .addCase(getCustomerAnalytics.rejected, (state, action) => {
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
                state.inventoryAnalytics = action.payload;
            })
            .addCase(getInventoryAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET TRAFFIC ANALYTICS ============
        builder
            .addCase(getTrafficAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTrafficAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.trafficAnalytics = action.payload;
            })
            .addCase(getTrafficAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET PAYMENT ANALYTICS ============
        builder
            .addCase(getPaymentAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentAnalytics = action.payload;
            })
            .addCase(getPaymentAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET SUMMARY ANALYTICS ============
        builder
            .addCase(getSummaryAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSummaryAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.summaryAnalytics = action.payload;
            })
            .addCase(getSummaryAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET TOP PRODUCTS ============
        builder
            .addCase(getTopProductsAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTopProductsAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.topProducts = action.payload.topProducts || [];
            })
            .addCase(getTopProductsAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GENERATE REPORT ============
        builder
            .addCase(generateAnalyticsReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateAnalyticsReport.fulfilled, (state, action) => {
                state.loading = false;
                state.report = action.payload;
                state.message = 'Report generated successfully!';
            })
            .addCase(generateAnalyticsReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage } = analyticsSlice.actions;
export default analyticsSlice.reducer;
