// ✅ UPDATED: src/pages/user/Checkout.jsx
// Handle "Buy Now" from product cards (single product checkout)

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../../REDUX/SLICES/orderSlice';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, message } = useSelector((state) => state.order);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Get quick buy product from navigation state
    const quickBuyProduct = location.state?.quickBuyProduct || null;

    // Cart items (or single product from quick buy)
    const [cartItems, setCartItems] = useState([]);

    const [formData, setFormData] = useState({
        shippingAddress: {
            fullName: '',
            phone: '',
            email: '',
            street: '',
            city: '',
            state: '',
            country: 'India',
            postalCode: ''
        },
        billingAddress: {
            fullName: '',
            phone: '',
            email: '',
            street: '',
            city: '',
            state: '',
            country: 'India',
            postalCode: ''
        },
        sameAsShipping: true,
        paymentMethod: 'cod',
        discountCode: ''
    });

    const [calculatedPricing, setCalculatedPricing] = useState({
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }

        // Set cart items from quick buy or cart
        if (quickBuyProduct) {
            setCartItems([
                {
                    product: quickBuyProduct._id,
                    quantity: quickBuyProduct.quantity || 1,
                    price: quickBuyProduct.price
                }
            ]);
        } else {
            // TODO: Get from cart Redux when cart is implemented
            setCartItems([]);
        }
    }, [isAuthenticated, navigate, quickBuyProduct]);

    // Calculate pricing whenever cart items change
    useEffect(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = (subtotal * 18) / 100;
        const total = subtotal + tax;

        setCalculatedPricing({
            subtotal,
            discount: 0,
            tax,
            total
        });
    }, [cartItems]);

    const handleInputChange = (e, addressType, field) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [addressType]: {
                ...prev[addressType],
                [field]: value
            }
        }));
    };

    const handleSameAsShipping = (e) => {
        setFormData(prev => ({
            ...prev,
            sameAsShipping: e.target.checked,
            billingAddress: e.target.checked ? prev.shippingAddress : prev.billingAddress
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.shippingAddress.fullName.trim()) {
            alert('Please enter your full name');
            return;
        }
        if (!formData.shippingAddress.phone.trim()) {
            alert('Please enter your phone number');
            return;
        }
        if (!formData.shippingAddress.street.trim()) {
            alert('Please enter your street address');
            return;
        }
        if (!formData.shippingAddress.city.trim()) {
            alert('Please enter your city');
            return;
        }

        const orderData = {
            items: cartItems,
            shippingAddress: formData.shippingAddress,
            billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
            paymentMethod: formData.paymentMethod,
            discountCode: formData.discountCode || undefined
        };

        dispatch(createOrder(orderData)).then((result) => {
            if (result.payload?.order) {
                navigate(`/order/confirmation/${result.payload.order._id}`);
            }
        });
    };

    // Show empty cart message if no items
    if (!loading && cartItems.length === 0 && !quickBuyProduct) {
        return (
            <div className="min-h-screen bg-yellow-50 py-8">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h1 className="text-4xl font-bold mb-2">Your cart is empty</h1>
                    <p className="text-gray-600 mb-6">Add products to continue shopping</p>
                    <a href="/" className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold">
                        🛍️ Continue Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-50 py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h1 className="text-4xl font-bold mb-8">🛒 Checkout</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Shipping Address Section */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">📍 Shipping Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.shippingAddress.fullName}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress', 'fullName')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={formData.shippingAddress.phone}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress', 'phone')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.shippingAddress.email}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress', 'email')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        value={formData.shippingAddress.street}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress', 'street')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={formData.shippingAddress.city}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress', 'city')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={formData.shippingAddress.state}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress', 'state')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        value={formData.shippingAddress.postalCode}
                                        onChange={(e) => handleInputChange(e, 'shippingAddress', 'postalCode')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Billing Address Toggle */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.sameAsShipping}
                                        onChange={handleSameAsShipping}
                                        className="w-4 h-4"
                                    />
                                    <span className="font-semibold">Billing address same as shipping</span>
                                </label>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">💰 Payment Method</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-semibold">Cash on Delivery (COD)</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={formData.paymentMethod === 'upi'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-semibold">UPI Payment</span>
                                    </label>
                                </div>
                            </div>

                            {/* Discount Code */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-4">🎟️ Discount Code (Optional)</h2>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter discount code"
                                        value={formData.discountCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <button type="button" className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || cartItems.length === 0}
                                className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition disabled:opacity-50 text-lg"
                            >
                                {loading ? '⏳ Processing Order...' : '✓ Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                            <h2 className="text-2xl font-bold mb-6">📋 Order Summary</h2>

                            {/* Items */}
                            <div className="border-b border-gray-200 pb-4 mb-4">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between mb-2 text-sm">
                                        <span className="text-gray-600">
                                            {quickBuyProduct?.name || 'Product'} × {item.quantity}
                                        </span>
                                        <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing Breakdown */}
                            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>₹{calculatedPricing.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (18%)</span>
                                    <span>₹{Math.round(calculatedPricing.tax).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-2xl font-bold mb-6">
                                <span>Total</span>
                                <span className="text-teal-600">₹{Math.round(calculatedPricing.total).toLocaleString('en-IN')}</span>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                ℹ️ You'll get order confirmation email after successful order placement.
                            </div>

                            {/* Back to Shopping */}
                            <a 
                                href="/"
                                className="block mt-4 text-center text-teal-600 hover:underline font-semibold"
                            >
                                ← Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;