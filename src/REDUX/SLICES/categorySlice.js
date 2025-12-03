
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/category', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getCategoryById = createAsyncThunk(
    'category/getCategoryById',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/category/${categoryId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getSubcategories = createAsyncThunk(
    'category/getSubcategories',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/category/${categoryId}/subcategories`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const createCategory = createAsyncThunk(
    'category/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.post('/category', categoryData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ categoryId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/category/${categoryId}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            await api.delete(`/category/${categoryId}`);
            return categoryId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const searchCategories = createAsyncThunk(
    'category/searchCategories',
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.get(`/category/search/query?q=${query}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// SLICE
// ============================================

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        selectedCategory: null,
        subcategories: [],
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
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ============ GET ALL CATEGORIES ============
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories || [];
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET CATEGORY BY ID ============
        builder
            .addCase(getCategoryById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCategory = action.payload.category;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET SUBCATEGORIES ============
        builder
            .addCase(getSubcategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubcategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = action.payload.subcategories || [];
            })
            .addCase(getSubcategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ CREATE CATEGORY (ADMIN) ============
        builder
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload.category);
                state.message = 'Category created!';
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ UPDATE CATEGORY (ADMIN) ============
        builder
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(
                    (cat) => cat._id === action.payload.category._id
                );
                if (index !== -1) {
                    state.categories[index] = action.payload.category;
                }
                state.message = 'Category updated!';
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ DELETE CATEGORY (ADMIN) ============
        builder
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(
                    (cat) => cat._id !== action.payload
                );
                state.message = 'Category deleted!';
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ SEARCH CATEGORIES ============
        builder
            .addCase(searchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories || [];
            })
            .addCase(searchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage, setSelectedCategory } =
    categorySlice.actions;
export default categorySlice.reducer;
