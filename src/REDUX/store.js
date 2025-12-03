import { configureStore } from '@reduxjs/toolkit'

import authReducer from './SLICES/authSlice.js'
import userReducer from './SLICES/userSlice.js'
import categoryReducer from './SLICES/categorySlice.js'
import productReducer from './SLICES/productSlice.js';
import orderReducer from './SLICES/orderSlice.js'
import analyticsReducer from './SLICES/analyticsSlice.js'
import pricingReducer from './SLICES/pricingSlice.js'
import inventoryReducer from './SLICES/inventorySlice.js'
import discountReducer from './SLICES/discountSlice.js';
import paymentReducer from './SLICES/paymentSlice.js';
import uiReducer from './SLICES/uiSlice.js'
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        category: categoryReducer,
        product: productReducer,
        order: orderReducer,
        analytics: analyticsReducer,
        pricing: pricingReducer,
        inventory: inventoryReducer,
        discount: discountReducer,
        payment: paymentReducer,
        ui: uiReducer,
    },
//    middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 // Ignore these action types for serializable check
//                 ignoredActions: ['payment/initiatePayment/fulfilled'],
//                 ignoredPaths: ['payment.paymentIntent'],
//             },
//         }).concat([
//             // Add custom middleware here if needed
//         ]),
//     devTools: process.env.NODE_ENV !== 'production',
    devTools:true
})

export default store;
