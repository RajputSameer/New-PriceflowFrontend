// ✅ src/pages/user/Orders.jsx
// My Orders list page showing all user orders

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrders } from '../../REDUX/SLICES/orderSlice';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        dispatch(getOrders({ status: filterStatus !== 'all' ? filterStatus : undefined }));
    }, [dispatch, filterStatus]);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            shipped: 'bg-cyan-100 text-cyan-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            returned: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: '⏳',
            confirmed: '✓',
            processing: '🔄',
            shipped: '📦',
            delivered: '✅',
            cancelled: '❌',
            returned: '↩️'
        };
        return icons[status] || '📋';
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortBy === 'recent') {
            return new Date(b.orderDate) - new Date(a.orderDate);
        } else if (sortBy === 'oldest') {
            return new Date(a.orderDate) - new Date(b.orderDate);
        } else if (sortBy === 'highest') {
            return (b.pricing?.total || 0) - (a.pricing?.total || 0);
        } else if (sortBy === 'lowest') {
            return (a.pricing?.total || 0) - (b.pricing?.total || 0);
        }
        return 0;
    });

    return (
        <div className="min-h-screen bg-yellow-50 py-8">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <h1 className="text-4xl font-bold mb-8">📋 My Orders</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Filter */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Filter by Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Sort by</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Summary</label>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-2xl font-bold text-teal-600">{orders.length}</p>
                            <p className="text-xs text-gray-600">Total Orders</p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin text-4xl mb-4">⏳</div>
                        <p className="text-gray-600 font-semibold">Loading your orders...</p>
                    </div>
                ) : sortedOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold mb-2">No Orders Found</h3>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                        <Link
                            to="/"
                            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                        >
                            🛍️ Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                                    {/* Order Info */}
                                    <div>
                                        <p className="text-sm text-gray-600">Order Number</p>
                                        <p className="text-lg font-bold">{order.orderNumber}</p>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <p className="text-sm text-gray-600">Order Date</p>
                                        <p className="font-semibold">
                                            {new Date(order.orderDate).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-xl font-bold text-teal-600">₹{(order.pricing?.total || 0).toLocaleString()}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 justify-end">
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm font-semibold"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            to={`/order/track/${order._id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                                        >
                                            Track
                                        </Link>
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">Items ({order.items?.length || 0})</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {order.items?.map((item, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                                                {item.product?.name || 'Product'} × {item.quantity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;