
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

export const getBusinessProfile = createAsyncThunk(
    'user/getBusinessProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/business-profile');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateBusinessProfile = createAsyncThunk(
    'user/updateBusinessProfile',
    async (businessData, { rejectWithValue }) => {
        try {
            const response = await api.put('/user/business-profile', businessData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getWishlist = createAsyncThunk(
    'user/getWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/wishlist');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'user/addToWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user/wishlist/add/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'user/removeFromWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/user/wishlist/remove/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getLoyaltyPoints = createAsyncThunk(
    'user/getLoyaltyPoints',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/loyalty/balance');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/admin/users', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const banUser = createAsyncThunk(
    'user/banUser',
    async ({ userId, reason }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user/admin/users/${userId}/ban`, {
                reason,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// SLICE
// ============================================

const userSlice = createSlice({
    name: 'user',
    initialState: {
        businessProfile: null,
        wishlist: [],
        loyaltyPoints: 0,
        allUsers: [],
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
        // ============ GET BUSINESS PROFILE ============
        builder
            .addCase(getBusinessProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBusinessProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.businessProfile = action.payload.businessProfile;
            })
            .addCase(getBusinessProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ UPDATE BUSINESS PROFILE ============
        builder
            .addCase(updateBusinessProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBusinessProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.businessProfile = action.payload.businessProfile;
                state.message = action.payload.message || 'Profile updated!';
            })
            .addCase(updateBusinessProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET WISHLIST ============
        builder
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload.wishlist || [];
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ ADD TO WISHLIST ============
        builder
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload.wishlist;
                state.message = 'Added to wishlist!';
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ REMOVE FROM WISHLIST ============
        builder
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload.wishlist;
                state.message = 'Removed from wishlist!';
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET LOYALTY POINTS ============
        builder
            .addCase(getLoyaltyPoints.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLoyaltyPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.loyaltyPoints = action.payload.loyaltyPoints || 0;
            })
            .addCase(getLoyaltyPoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET ALL USERS (ADMIN) ============
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload.users || [];
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ BAN USER (ADMIN) ============
        builder
            .addCase(banUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(banUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || 'User banned!';
            })
            .addCase(banUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage } = userSlice.actions;
export default userSlice.reducer;
