
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

// Get Payment Methods
export const getPaymentMethods = createAsyncThunk(
    'payment/getMethods',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payment/methods');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment methods');
        }
    }
);

// Get Payments
export const getPayments = createAsyncThunk(
    'payment/getPayments',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/payment/my-payments/list', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
        }
    }
);

// Get Payment by ID
export const getPaymentById = createAsyncThunk(
    'payment/getPaymentById',
    async (paymentId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/payment/${paymentId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment');
        }
    }
);

// Initiate Payment
export const initiatePayment = createAsyncThunk(
    'payment/initiatePayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await api.post('/payment', paymentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to initiate payment');
        }
    }
);

// Create Payment Intent
export const createPaymentIntent = createAsyncThunk(
    'payment/createIntent',
    async (intentData, { rejectWithValue }) => {
        try {
            const response = await api.post('/payment/intent/create', intentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
        }
    }
);

// Verify Payment
export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async ({ paymentId, data }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/payment/${paymentId}/verify`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
        }
    }
);

// Get Payment Status
export const getPaymentStatus = createAsyncThunk(
    'payment/getStatus',
    async (paymentId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/payment/${paymentId}/status`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment status');
        }
    }
);

// Cancel Payment
export const cancelPayment = createAsyncThunk(
    'payment/cancelPayment',
    async (paymentId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/payment/${paymentId}/cancel`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel payment');
        }
    }
);

// Refund Payment
export const refundPayment = createAsyncThunk(
    'payment/refundPayment',
    async ({ paymentId, reason }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/payment/${paymentId}/refund`, { reason });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to refund payment');
        }
    }
);

// Get Payment Analytics
export const getPaymentAnalytics = createAsyncThunk(
    'payment/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/analytics/dashboard/payments');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment analytics');
        }
    }
);

// ============================================
// SLICE
// ============================================

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payments: [],
        selectedPayment: null,
        paymentMethods: [],
        paymentStatus: null,
        analytics: null,
        paymentIntent: null,
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
        setSelectedPayment: (state, action) => {
            state.selectedPayment = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ============ GET PAYMENT METHODS ============
        builder
            .addCase(getPaymentMethods.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentMethods.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = action.payload.methods || [];
            })
            .addCase(getPaymentMethods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET PAYMENTS ============
        builder
            .addCase(getPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload.payments || [];
            })
            .addCase(getPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET PAYMENT BY ID ============
        builder
            .addCase(getPaymentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPayment = action.payload.payment;
            })
            .addCase(getPaymentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ INITIATE PAYMENT ============
        builder
            .addCase(initiatePayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(initiatePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPayment = action.payload.payment;
                state.message = 'Payment initiated!';
            })
            .addCase(initiatePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ CREATE PAYMENT INTENT ============
        builder
            .addCase(createPaymentIntent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentIntent = action.payload;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ VERIFY PAYMENT ============
        builder
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPayment = action.payload.payment;
                state.message = 'Payment verified!';
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET PAYMENT STATUS ============
        builder
            .addCase(getPaymentStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentStatus = action.payload;
            })
            .addCase(getPaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ CANCEL PAYMENT ============
        builder
            .addCase(cancelPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(cancelPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.message = 'Payment cancelled!';
            })
            .addCase(cancelPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ REFUND PAYMENT ============
        builder
            .addCase(refundPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(refundPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.message = 'Payment refunded!';
            })
            .addCase(refundPayment.rejected, (state, action) => {
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
                state.analytics = action.payload;
            })
            .addCase(getPaymentAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage, setSelectedPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
