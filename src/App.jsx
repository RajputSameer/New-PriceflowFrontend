// ✅ FIXED & CORRECTED: App.jsx with Seller Route Protection

import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import HomeLayout from './LAYOUTS/HomeLayout';

// Auth Pages
import Login from './PAGES/AUTH/Login';
import Register from './PAGES/AUTH/Register';

// User Pages
import Home from './PAGES/USER/Home';
import Profile from './PAGES/USER/Profile';
import Cart from './PAGES/USER/Cart';
import Wishlist from './PAGES/USER/Wishlist';
import TrackOrder from './PAGES/USER/TrackOrder';
import OrderDetails from './PAGES/USER/OrderDetails';
import Orders from './PAGES/USER/Orders';
import OrderConfirmation from './PAGES/USER/OrderConfirmation';
import Checkout from './PAGES/USER/Checkout';

// Seller Pages - FIXED: Added missing imports
import SellerDashboard from './PAGES/SELLER/SellerDashboard';
import SellerProducts from './PAGES/SELLER/SellerProducts';
import SellerOrders from './PAGES/SELLER/SellerOrders';
import SellerAnalytics from './PAGES/SELLER/SellerAnalytics';
import SellerInventory from './PAGES/SELLER/SellerInventory';
import SellerPricing from './PAGES/SELLER/SellerPricing';
import SellerDiscounts from './PAGES/SELLER/SellerDiscounts';
import SellerPayments from './PAGES/SELLER/SellerPayments';
import CreateProduct from './PAGES/SELLER/CreateProduct';
import ProductDetail from './PAGES/USER/ProductDetail';
import Search from './PAGES/Search';

// ============================================
// PROTECTED ROUTE COMPONENT - FIXED & ENHANCED
// ============================================
/**
 * ProtectedRoute Component
 * Protects routes based on:
 * 1. Authentication status
 * 2. Required role (SELLER, ADMIN, USER)
 */
const ProtectedRoute = ({ component, requiredRole = null }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // ❌ Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // ❌ User doesn't have required role - redirect to home
    if (requiredRole && user?.role !== requiredRole) {
        console.warn(`Access denied. User role: ${user?.role}, Required: ${requiredRole}`);
        return <Navigate to="/" replace />;
    }

    // ✅ User is authenticated and has correct role
    return component;
};

// ============================================
// 404 PAGE (Optional but Recommended)
// ============================================
const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-2xl text-gray-600 mb-8">Page not found</p>
            <a 
                href="/" 
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
            >
                Go Home
            </a>
        </div>
    </div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
    return (
        <Routes>
            {/* ============================================
                AUTH ROUTES (No Layout - Public)
                ============================================ */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ============================================
                PUBLIC & USER ROUTES (With HomeLayout)
                ============================================ */}
            <Route element={<HomeLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Protected USER Routes */}
                <Route
                    path="/profile"
                    element={<ProtectedRoute component={<Profile />} />}
                />
                <Route
                    path="/cart"
                    element={<ProtectedRoute component={<Cart />} />}
                />
                <Route 
                    path="/wishlist"
                    element={<ProtectedRoute component={<Wishlist />} />}
                />
                <Route path="/product/:productId" element={<ProductDetail />} />
<Route path="/search" element={<Search />} />  {/* ✅ NEW */}
                {/* ============================================
                    ORDER ROUTES ✅ (Protected - User)
                    ============================================ */}
                <Route
                    path="/checkout"
                    element={<ProtectedRoute component={<Checkout />} />}
                />
                <Route
                    path="/order/confirmation/:orderId"
                    element={<ProtectedRoute component={<OrderConfirmation />} />}
                />
                <Route
                    path="/orders"
                    element={<ProtectedRoute component={<Orders />} />}
                />
                <Route
                    path="/order/:orderId"
                    element={<ProtectedRoute component={<OrderDetails />} />}
                />
                <Route
                    path="/order/track/:orderId"
                    element={<ProtectedRoute component={<TrackOrder />} />}
                />

                {/* ============================================
                    SELLER ROUTES ✅ (Protected - SELLER ROLE)
                    ============================================ */}
                <Route
                    path="/seller"
                    element={<ProtectedRoute component={<SellerDashboard />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/dashboard"
                    element={<ProtectedRoute component={<SellerDashboard />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/products"
                    element={<ProtectedRoute component={<SellerProducts />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/orders"
                    element={<ProtectedRoute component={<SellerOrders />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/analytics"
                    element={<ProtectedRoute component={<SellerAnalytics />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/inventory"
                    element={<ProtectedRoute component={<SellerInventory />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/pricing"
                    element={<ProtectedRoute component={<SellerPricing />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/discounts"
                    element={<ProtectedRoute component={<SellerDiscounts />} requiredRole="SELLER" />}
                />
                <Route
                    path="/seller/payments"
                    element={<ProtectedRoute component={<SellerPayments />} requiredRole="SELLER" />}
                />
                 <Route
                    path="/seller/products/create"
                    element={<ProtectedRoute component={<CreateProduct />} requiredRole="SELLER" />}
                />


                {/* ============================================
                    ADMIN ROUTES (Optional - Future)
                    ============================================ */}
                {/* Add admin routes here with requiredRole="ADMIN" */}

            </Route>

            {/* ============================================
                CATCH-ALL - 404 Page
                ============================================ */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
