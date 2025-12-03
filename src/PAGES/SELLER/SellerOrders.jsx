// ✅ SELLER: src/pages/seller/SellerOrders.jsx
// View and manage seller orders

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../REDUX/SLICES/orderSlice';

const SellerOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);
    
    const [filters, setFilters] = useState({ status: 'all', search: '' });
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700'
    };

    const filteredOrders = orders?.filter(o => {
        const matchesStatus = filters.status === 'all' || o.status === filters.status;
        const matchesSearch = o._id.includes(filters.search);
        return matchesStatus && matchesSearch;
    });

    const sortedOrders = [...(filteredOrders || [])].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'price-high') return b.totalAmount - a.totalAmount;
        if (sortBy === 'price-low') return a.totalAmount - b.totalAmount;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900">📦 Orders</h1>
                    <p className="text-gray-600 mt-1">Manage all your orders</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by Order ID..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-high">Amount: High to Low</option>
                            <option value="price-low">Amount: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                {!loading && sortedOrders?.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold">Order ID</th>
                                        <th className="px-6 py-4 text-left font-bold">Customer</th>
                                        <th className="px-6 py-4 text-center font-bold">Items</th>
                                        <th className="px-6 py-4 text-right font-bold">Amount</th>
                                        <th className="px-6 py-4 text-center font-bold">Status</th>
                                        <th className="px-6 py-4 text-left font-bold">Date</th>
                                        <th className="px-6 py-4 text-center font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedOrders.map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-semibold text-teal-600">#{order._id.slice(-6)}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
                                                <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">{order.items?.length || 0}</td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
                                                    {order.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link 
                                                    to={`/seller/orders/${order._id}`}
                                                    className="text-blue-600 hover:underline text-sm font-semibold"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && (!sortedOrders || sortedOrders.length === 0) && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600">Your orders will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrders;
