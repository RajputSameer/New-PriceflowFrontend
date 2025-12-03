
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

// Get Active Discounts
export const getActiveDiscounts = createAsyncThunk(
    'discount/getActive',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/discount/active');
            return response.data;
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

// Get Discount by ID
export const getDiscountById = createAsyncThunk(
    'discount/getDiscountById',
    async (discountId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/discount/${discountId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch discount');
        }
    }
);

// Create Discount
export const createDiscount = createAsyncThunk(
    'discount/createDiscount',
    async (discountData, { rejectWithValue }) => {
        try {
            const response = await api.post('/discount', discountData);
            return response.data;
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
            return response.data;
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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

// ============================================
// SLICE
// ============================================

const discountSlice = createSlice({
    name: 'discount',
    initialState: {
        discounts: [],
        activeDiscounts: [],
        selectedDiscount: null,
        discountStats: {},
        validationResult: null,
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
        setSelectedDiscount: (state, action) => {
            state.selectedDiscount = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ============ GET ACTIVE DISCOUNTS ============
        builder
            .addCase(getActiveDiscounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getActiveDiscounts.fulfilled, (state, action) => {
                state.loading = false;
                state.activeDiscounts = action.payload.discounts || [];
            })
            .addCase(getActiveDiscounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET DISCOUNTS ============
        builder
            .addCase(getDiscounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDiscounts.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = action.payload.discounts || [];
            })
            .addCase(getDiscounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET DISCOUNT BY ID ============
        builder
            .addCase(getDiscountById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDiscountById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedDiscount = action.payload.discount;
            })
            .addCase(getDiscountById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ CREATE DISCOUNT ============
        builder
            .addCase(createDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts.push(action.payload.discount);
                state.message = 'Discount created!';
            })
            .addCase(createDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ UPDATE DISCOUNT ============
        builder
            .addCase(updateDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.discounts.findIndex(
                    (d) => d._id === action.payload.discount._id
                );
                if (index !== -1) {
                    state.discounts[index] = action.payload.discount;
                }
                state.message = 'Discount updated!';
            })
            .addCase(updateDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ DELETE DISCOUNT ============
        builder
            .addCase(deleteDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = state.discounts.filter(
                    (d) => d._id !== action.payload
                );
                state.message = 'Discount deleted!';
            })
            .addCase(deleteDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ VALIDATE DISCOUNT CODE ============
        builder
            .addCase(validateDiscountCode.pending, (state) => {
                state.loading = true;
            })
            .addCase(validateDiscountCode.fulfilled, (state, action) => {
                state.loading = false;
                state.validationResult = action.payload;
            })
            .addCase(validateDiscountCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET DISCOUNT STATS ============
        builder
            .addCase(getDiscountStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDiscountStats.fulfilled, (state, action) => {
                state.loading = false;
                state.discountStats = action.payload.stats || {};
            })
            .addCase(getDiscountStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage, setSelectedDiscount } = discountSlice.actions;
export default discountSlice.reducer;
