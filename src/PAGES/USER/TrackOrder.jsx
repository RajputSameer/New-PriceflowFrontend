// ✅ src/pages/user/TrackOrder.jsx
// Order tracking page with timeline and status updates

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../REDUX/SLICES/orderSlice';

const TrackOrder = () => {
    const dispatch = useDispatch();
    const { orderId } = useParams();
    const { selectedOrder, loading } = useSelector((state) => state.order);

    useEffect(() => {
        if (orderId) {
            dispatch(getOrderById(orderId));
        }
    }, [orderId, dispatch]);

    const orderStatuses = [
        {
            stage: 'Order Placed',
            icon: '✓',
            description: 'Your order has been placed successfully',
            completed: true
        },
        {
            stage: 'Confirmed',
            icon: '✓',
            description: 'Order has been confirmed by seller',
            completed: selectedOrder?.status !== 'pending'
        },
        {
            stage: 'Processing',
            icon: '🔄',
            description: 'Items are being prepared for shipment',
            completed: ['processing', 'shipped', 'delivered'].includes(selectedOrder?.status)
        },
        {
            stage: 'Shipped',
            icon: '📦',
            description: 'Your order is on the way',
            completed: ['shipped', 'delivered'].includes(selectedOrder?.status)
        },
        {
            stage: 'Delivered',
            icon: '✅',
            description: 'Order delivered successfully',
            completed: selectedOrder?.status === 'delivered'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600 font-semibold">Loading tracking info...</p>
                </div>
            </div>
        );
    }

    if (!selectedOrder) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
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
        <div className="min-h-screen bg-blue-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/orders" className="text-teal-600 hover:underline mb-4 inline-block">
                        ← Back to Orders
                    </Link>
                    <h1 className="text-4xl font-bold">📦 Track Your Order</h1>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <p className="text-xl font-bold text-blue-600 capitalize">
                                {selectedOrder.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-8">Order Timeline</h2>
                    <div className="space-y-6">
                        {orderStatuses.map((status, idx) => (
                            <div key={idx} className="flex gap-6 items-start">
                                {/* Timeline Circle */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                                        status.completed
                                            ? 'bg-green-500 text-white'
                                            : idx === orderStatuses.findIndex(s => !s.completed)
                                            ? 'bg-blue-500 text-white ring-4 ring-blue-200 animate-pulse'
                                            : 'bg-gray-300 text-gray-600'
                                    }`}>
                                        {status.icon}
                                    </div>
                                    {idx !== orderStatuses.length - 1 && (
                                        <div className={`w-1 h-16 ${
                                            status.completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>

                                {/* Timeline Content */}
                                <div className="flex-1 pt-2">
                                    <h3 className="text-lg font-bold text-gray-900">{status.stage}</h3>
                                    <p className="text-gray-600 text-sm">{status.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {status.completed ? '✓ Completed' : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Details */}
                {selectedOrder.shipping && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">📍 Shipping Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedOrder.shipping.trackingNumber && (
                                <div>
                                    <p className="text-gray-600 text-sm">Tracking Number</p>
                                    <p className="font-mono font-semibold text-lg">
                                        {selectedOrder.shipping.trackingNumber}
                                    </p>
                                </div>
                            )}
                            {selectedOrder.shipping.carrier && (
                                <div>
                                    <p className="text-gray-600 text-sm">Carrier</p>
                                    <p className="font-semibold text-lg capitalize">
                                        {selectedOrder.shipping.carrier}
                                    </p>
                                </div>
                            )}
                            {selectedOrder.shipping.estimatedDelivery && (
                                <div>
                                    <p className="text-gray-600 text-sm">Estimated Delivery</p>
                                    <p className="font-semibold text-lg">
                                        {new Date(selectedOrder.shipping.estimatedDelivery).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                            )}
                            {selectedOrder.shipping.actualDelivery && (
                                <div>
                                    <p className="text-gray-600 text-sm">Delivered On</p>
                                    <p className="font-semibold text-lg text-green-600">
                                        {new Date(selectedOrder.shipping.actualDelivery).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">📮 Delivery Address</h2>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="font-semibold text-lg mb-2">{selectedOrder.shippingAddress?.fullName}</p>
                        <div className="text-gray-700 space-y-1 text-sm">
                            <p>{selectedOrder.shippingAddress?.street}</p>
                            <p>
                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                            </p>
                            <p>
                                {selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.postalCode}
                            </p>
                            <p className="font-semibold mt-2">📞 {selectedOrder.shippingAddress?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Items in Order */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">🛍️ Items ({selectedOrder.items?.length || 0})</h2>
                    <div className="space-y-3">
                        {selectedOrder.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold">{item.product?.name || 'Product'}</p>
                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-teal-600">₹{(item.total || 0).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Total */}
                <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold">Total Amount</p>
                        <p className="text-3xl font-bold text-teal-600">
                            ₹{(selectedOrder.pricing?.total || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-4">
                    ℹ️ If you have any questions about your order, please check your email or contact our support team.
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Link
                        to={`/order/${selectedOrder._id}`}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                    >
                        📋 View Full Details
                    </Link>
                    <Link
                        to="/orders"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
                    >
                        📦 All Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;