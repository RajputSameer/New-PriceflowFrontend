
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

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

// Get Pricing Strategy by ID
export const getPricingStrategyById = createAsyncThunk(
    'pricing/getStrategyById',
    async (strategyId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/pricing/${strategyId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch strategy');
        }
    }
);

// Create Pricing Strategy
export const createPricingStrategy = createAsyncThunk(
    'pricing/createStrategy',
    async (strategyData, { rejectWithValue }) => {
        try {
            const response = await api.post('/pricing', strategyData);
            return response.data;
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
            return response.data;
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
            return response.data;
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

// Apply Dynamic Pricing
export const applyDynamicPricing = createAsyncThunk(
    'pricing/applyDynamic',
    async (pricingData, { rejectWithValue }) => {
        try {
            const response = await api.post('/pricing/apply-dynamic', pricingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to apply dynamic pricing');
        }
    }
);

// ============================================
// SLICE
// ============================================

const pricingSlice = createSlice({
    name: 'pricing',
    initialState: {
        strategies: [],
        selectedStrategy: null,
        pricingAnalytics: null,
        calculatedPrice: null,
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
        setSelectedStrategy: (state, action) => {
            state.selectedStrategy = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ============ GET STRATEGIES ============
        builder
            .addCase(getPricingStrategies.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPricingStrategies.fulfilled, (state, action) => {
                state.loading = false;
                state.strategies = action.payload.strategies || [];
            })
            .addCase(getPricingStrategies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET STRATEGY BY ID ============
        builder
            .addCase(getPricingStrategyById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPricingStrategyById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStrategy = action.payload.strategy;
            })
            .addCase(getPricingStrategyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ CREATE STRATEGY ============
        builder
            .addCase(createPricingStrategy.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPricingStrategy.fulfilled, (state, action) => {
                state.loading = false;
                state.strategies.push(action.payload.strategy);
                state.message = 'Pricing strategy created!';
            })
            .addCase(createPricingStrategy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ UPDATE STRATEGY ============
        builder
            .addCase(updatePricingStrategy.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePricingStrategy.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.strategies.findIndex(
                    (s) => s._id === action.payload.strategy._id
                );
                if (index !== -1) {
                    state.strategies[index] = action.payload.strategy;
                }
                state.message = 'Pricing strategy updated!';
            })
            .addCase(updatePricingStrategy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ DELETE STRATEGY ============
        builder
            .addCase(deletePricingStrategy.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePricingStrategy.fulfilled, (state, action) => {
                state.loading = false;
                state.strategies = state.strategies.filter(
                    (s) => s._id !== action.payload
                );
                state.message = 'Pricing strategy deleted!';
            })
            .addCase(deletePricingStrategy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET PRICING ANALYTICS ============
        builder
            .addCase(getPricingAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPricingAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.pricingAnalytics = action.payload;
            })
            .addCase(getPricingAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ CALCULATE PRICE ============
        builder
            .addCase(calculatePrice.pending, (state) => {
                state.loading = true;
            })
            .addCase(calculatePrice.fulfilled, (state, action) => {
                state.loading = false;
                state.calculatedPrice = action.payload;
            })
            .addCase(calculatePrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ APPLY DYNAMIC PRICING ============
        builder
            .addCase(applyDynamicPricing.pending, (state) => {
                state.loading = true;
            })
            .addCase(applyDynamicPricing.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || 'Dynamic pricing applied!';
            })
            .addCase(applyDynamicPricing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage, setSelectedStrategy } = pricingSlice.actions;
export default pricingSlice.reducer;
