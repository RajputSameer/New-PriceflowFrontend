// ✅ src/pages/user/OrderDetails.jsx
// Detailed view of a single order

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../../REDUX/SLICES/orderSlice';

const OrderDetails = () => {
    const dispatch = useDispatch();
    const { orderId } = useParams();
    const { selectedOrder, loading, error, message } = useSelector((state) => state.order);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderById(orderId));
        }
    }, [orderId, dispatch]);

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }
        dispatch(cancelOrder(orderId)).then(() => {
            setShowCancelModal(false);
            setCancelReason('');
        });
    };

    const canCancelOrder = selectedOrder && 
        !['delivered', 'cancelled', 'returned'].includes(selectedOrder.status);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600 font-semibold">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">Order not found!</p>
                    <Link to="/orders" className="text-teal-600 hover:underline mt-2">
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/orders" className="text-teal-600 hover:underline mb-4 inline-block">
                        ← Back to Orders
                    </Link>
                    <h1 className="text-4xl font-bold">📦 Order Details</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-600">
                        ✓ {message}
                    </div>
                )}

                {/* Order Header Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-600 text-sm">Order Number</p>
                            <p className="text-2xl font-bold">{selectedOrder.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Order Date</p>
                            <p className="text-lg font-semibold">
                                {new Date(selectedOrder.orderDate).toLocaleDateString('en-IN')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Current Status</p>
                            <p className={`text-lg font-bold capitalize ${
                                selectedOrder.status === 'delivered' ? 'text-green-600' :
                                selectedOrder.status === 'shipped' ? 'text-blue-600' :
                                selectedOrder.status === 'cancelled' ? 'text-red-600' :
                                'text-yellow-600'
                            }`}>
                                {selectedOrder.status}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Amount</p>
                            <p className="text-2xl font-bold text-teal-600">
                                ₹{(selectedOrder.pricing?.total || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">🛍️ Items in Order</h2>
                    <div className="space-y-4">
                        {selectedOrder.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-lg">{item.product?.name || 'Product'}</p>
                                    <p className="text-gray-600 text-sm">SKU: {item.product?.sku || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    <p className="font-semibold">₹{(item.price || 0).toLocaleString()}</p>
                                </div>
                                <div className="text-right font-bold text-lg">
                                    ₹{(item.total || 0).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">💰 Pricing Details</h2>
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold">₹{(selectedOrder.pricing?.subtotal || 0).toLocaleString()}</span>
                        </div>
                        {selectedOrder.pricing?.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{selectedOrder.pricing.discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax (18%)</span>
                            <span className="font-semibold">₹{(selectedOrder.pricing?.tax || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-green-600 font-semibold">FREE</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-teal-600">
                        <span>Total</span>
                        <span>₹{(selectedOrder.pricing?.total || 0).toLocaleString()}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">📍 Shipping Address</h2>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="font-semibold text-lg">{selectedOrder.shippingAddress?.fullName}</p>
                        <p className="text-gray-600">{selectedOrder.shippingAddress?.street}</p>
                        <p className="text-gray-600">
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                        </p>
                        <p className="text-gray-600">
                            {selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.postalCode}
                        </p>
                        <p className="text-gray-600 font-semibold">📞 {selectedOrder.shippingAddress?.phone}</p>
                        <p className="text-gray-600">📧 {selectedOrder.shippingAddress?.email}</p>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">💳 Payment Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600 text-sm">Payment Method</p>
                            <p className="text-lg font-semibold capitalize">
                                {selectedOrder.payment?.method?.replace(/_/g, ' ')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Payment Status</p>
                            <p className={`text-lg font-semibold capitalize ${
                                selectedOrder.payment?.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                                {selectedOrder.payment?.status}
                            </p>
                        </div>
                        {selectedOrder.payment?.transactionId && (
                            <div className="col-span-2">
                                <p className="text-gray-600 text-sm">Transaction ID</p>
                                <p className="font-mono text-sm">{selectedOrder.payment.transactionId}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <Link
                        to={`/order/track/${selectedOrder._id}`}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                    >
                        📦 Track Order
                    </Link>
                    {canCancelOrder && (
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                            ❌ Cancel Order
                        </button>
                    )}
                    <Link
                        to="/orders"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
                    >
                        📋 Back to Orders
                    </Link>
                </div>

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-4">Cancel Order?</h3>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to cancel order {selectedOrder.orderNumber}?
                            </p>
                            <textarea
                                placeholder="Reason for cancellation"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                                rows="3"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancelOrder}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                                >
                                    ✓ Confirm Cancel
                                </button>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                                >
                                    ✕ Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
