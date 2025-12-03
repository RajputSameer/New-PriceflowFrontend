// ✅ src/pages/user/OrderConfirmation.jsx
// Order confirmation page after successful order creation

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../REDUX/SLICES/orderSlice';

const OrderConfirmation = () => {
    const dispatch = useDispatch();
    const { orderId } = useParams();
    const { selectedOrder, loading } = useSelector((state) => state.order);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderById(orderId));
        }
    }, [orderId, dispatch]);

    const handleCopyOrderNumber = () => {
        navigator.clipboard.writeText(selectedOrder?.orderNumber);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600 font-semibold">Loading your order...</p>
                </div>
            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">Order not found!</p>
                    <Link to="/" className="text-teal-600 hover:underline mt-2">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Success Banner */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">✅</div>
                    <h1 className="text-4xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 text-lg">Thank you for your order. You'll receive an email confirmation shortly.</p>
                </div>

                {/* Main Cards */}
                <div className="space-y-6">
                    {/* Order Number Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">📦 Order Number</h2>
                        <div className="flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-lg p-4">
                            <span className="text-2xl font-bold text-green-700">{selectedOrder.orderNumber}</span>
                            <button
                                onClick={handleCopyOrderNumber}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                {copySuccess ? '✓ Copied' : '📋 Copy'}
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">Save this number for tracking and reference</p>
                    </div>

                    {/* Order Status Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">📍 Order Status</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Current Status</p>
                                <p className="text-2xl font-bold text-blue-600 capitalize">{selectedOrder.status}</p>
                            </div>
                            <div className="text-5xl">
                                {selectedOrder.status === 'pending' && '⏳'}
                                {selectedOrder.status === 'confirmed' && '✓'}
                                {selectedOrder.status === 'processing' && '🔄'}
                                {selectedOrder.status === 'shipped' && '📦'}
                                {selectedOrder.status === 'delivered' && '✅'}
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">🛍️ Order Details</h2>
                        
                        {/* Items List */}
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h3 className="font-semibold mb-3">Items</h3>
                            <div className="space-y-2">
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                        <span className="text-gray-600">
                                            {item.product?.name || 'Product'} × {item.quantity}
                                        </span>
                                        <span className="font-semibold">₹{(item.total || 0).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{(selectedOrder.pricing?.subtotal || 0).toLocaleString()}</span>
                            </div>
                            {selectedOrder.pricing?.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{selectedOrder.pricing.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (18%)</span>
                                <span>₹{(selectedOrder.pricing?.tax || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-green-600 font-semibold">FREE</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between text-2xl font-bold">
                            <span>Total Amount</span>
                            <span className="text-teal-600">₹{(selectedOrder.pricing?.total || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">📍 Shipping Address</h2>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                            <p className="font-semibold text-lg">{selectedOrder.shippingAddress?.fullName}</p>
                            <p className="text-gray-600">{selectedOrder.shippingAddress?.street}</p>
                            <p className="text-gray-600">
                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                            </p>
                            <p className="text-gray-600">{selectedOrder.shippingAddress?.country}</p>
                            <p className="text-gray-600">📞 {selectedOrder.shippingAddress?.phone}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">💳 Payment Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm">Payment Method</p>
                                <p className="text-lg font-semibold capitalize">{selectedOrder.payment?.method?.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Payment Status</p>
                                <p className={`text-lg font-semibold capitalize ${
                                    selectedOrder.payment?.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                                }`}>
                                    {selectedOrder.payment?.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <Link
                            to={`/order/track/${selectedOrder._id}`}
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                        >
                            📦 Track Order
                        </Link>
                        <Link
                            to="/orders"
                            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                            📋 View All Orders
                        </Link>
                        <Link
                            to="/"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            🏠 Back to Home
                        </Link>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                        ℹ️ <strong>Next Steps:</strong> Your order is being prepared. You'll receive tracking information via email once it ships.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;