
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Get Profile
export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/profile');
            return response.data.profile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Update Profile
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await api.put('/user/profile', profileData);
            return response.data.profile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

// Change Password
export const changePassword = createAsyncThunk(
    'user/changePassword',
    async ({ oldPassword, newPassword }, { rejectWithValue }) => {
        try {
            const response = await api.post('/user/change-password', {
                oldPassword,
                newPassword,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change password');
        }
    }
);

// Get Business Profile
export const getBusinessProfile = createAsyncThunk(
    'user/getBusinessProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/business-profile');
            return response.data.businessProfile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch business profile');
        }
    }
);

// Update Business Profile
export const updateBusinessProfile = createAsyncThunk(
    'user/updateBusinessProfile',
    async (businessData, { rejectWithValue }) => {
        try {
            const response = await api.put('/user/business-profile', businessData);
            return response.data.businessProfile;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update business profile');
        }
    }
);

// Get Wishlist
export const getWishlist = createAsyncThunk(
    'user/getWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/wishlist');
            return response.data.wishlist;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
    'user/addToWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user/wishlist/add/${productId}`);
            return response.data.wishlist;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
        }
    }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
    'user/removeFromWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/user/wishlist/remove/${productId}`);
            return response.data.wishlist;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    }
);

// Get Loyalty Points
export const getLoyaltyPoints = createAsyncThunk(
    'user/getLoyaltyPoints',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/loyalty/balance');
            return response.data.loyaltyPoints;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch loyalty points');
        }
    }
);

// Get All Users (Admin)
export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/admin/users', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// Ban User (Admin)
export const banUser = createAsyncThunk(
    'user/banUser',
    async ({ userId, reason }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user/admin/users/${userId}/ban`, { reason });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to ban user');
        }
    }
);

// Unban User (Admin)
export const unbanUser = createAsyncThunk(
    'user/unbanUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user/admin/users/${userId}/unban`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to unban user');
        }
    }
);
