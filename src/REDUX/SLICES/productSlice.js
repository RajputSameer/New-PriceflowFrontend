// ✅ FIXED & UPDATED: src/REDUX/SLICES/productSlice.js
// Added updateProductPrice thunk

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../SERVICES/api';

// ============================================
// ASYNC THUNKS
// ============================================

export const getProducts = createAsyncThunk(
    'product/getProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/product', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getProductById = createAsyncThunk(
    'product/getProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/product/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);
// ✅ NEW: Upload product images
export const uploadProductImages = createAsyncThunk(
    'product/uploadProductImages',
    async ({ productId, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/product/${productId}/images/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


export const getTopProducts = createAsyncThunk(
    'product/getTopProducts',
    async (limit = 10, { rejectWithValue }) => {
        try {
            const response = await api.get(`/product/top?limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await api.post('/product', productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/product/${productId}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// ✅ NEW: Update Product Stock
export const updateProductStock = createAsyncThunk(
    'product/updateProductStock',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/product/${productId}/stock`, { quantity });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// ✅ NEW: Update Product Price
export const updateProductPrice = createAsyncThunk(
    'product/updateProductPrice',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            // data should contain: { costPrice, regularPrice, sellingPrice, discountPercentage }
            const response = await api.patch(`/product/${productId}/price`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            await api.delete(`/product/${productId}`);
            return productId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const searchProducts = createAsyncThunk(
    'product/searchProducts',
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.get(`/product/search?q=${query}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// SLICE
// ============================================

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        selectedProduct: null,
        topProducts: [],
        totalProducts: 0,
        currentPage: 1,
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
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ============ GET ALL PRODUCTS ============
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products || [];
                state.totalProducts = action.payload.total || 0;
                state.currentPage = action.payload.page || 1;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET PRODUCT BY ID ============
        builder
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
            })
           // ✅ AFTER (Keep the full response)
.addCase(getProductById.fulfilled, (state, action) => {
    state.loading = false;
    state.selectedProduct = action.payload;  // ← Keep full response: { success, product }
})
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET TOP PRODUCTS ============
        builder
            .addCase(getTopProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTopProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.topProducts = action.payload.topProducts || [];
            })
            .addCase(getTopProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ CREATE PRODUCT ============
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload.product);
                state.message = 'Product created!';
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
            // ============ UPLOAD PRODUCT IMAGES ============
builder
    .addCase(uploadProductImages.pending, (state) => {
        state.loading = true;
    })
    .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
            (p) => p._id === action.payload.product._id
        );
        if (index !== -1) {
            state.products[index] = action.payload.product;
        }
        state.message = 'Images uploaded successfully!';
    })
    .addCase(uploadProductImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    });


        // ============ UPDATE PRODUCT ============
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(
                    (p) => p._id === action.payload.product._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload.product;
                }
                state.message = 'Product updated!';
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✅ NEW: UPDATE PRODUCT STOCK ============
        builder
            .addCase(updateProductStock.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProductStock.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(
                    (p) => p._id === action.payload.product._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload.product;
                }
                state.message = 'Stock updated!';
            })
            .addCase(updateProductStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✅ NEW: UPDATE PRODUCT PRICE ============
        builder
            .addCase(updateProductPrice.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProductPrice.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(
                    (p) => p._id === action.payload.product._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload.product;
                }
                state.message = 'Price updated!';
            })
            .addCase(updateProductPrice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ DELETE PRODUCT ============
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(
                    (p) => p._id !== action.payload
                );
                state.message = 'Product deleted!';
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ SEARCH PRODUCTS ============
        builder
            .addCase(searchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products || [];
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearMessage, setSelectedProduct } =
    productSlice.actions;
export default productSlice.reducer;
