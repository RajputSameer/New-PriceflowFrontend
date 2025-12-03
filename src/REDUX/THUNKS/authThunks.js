
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Register
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ resetToken, newPassword }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/reset-password/${resetToken}`, {
                newPassword,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password reset failed');
        }
    }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (verificationToken, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/verify-email/${verificationToken}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Email verification failed');
        }
    }
);

// Restore Auth
export const restoreAuthFromStorage = createAsyncThunk(
    'auth/restore',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                return { token, user: JSON.parse(user) };
            }
            return null;
        } catch (error) {
            return rejectWithValue('Failed to restore auth');
        }
    }
);
