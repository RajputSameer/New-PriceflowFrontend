// ✅ SELLER: src/pages/seller/SellerDashboard.jsx
// Main dashboard with KPIs, charts, and quick stats

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSalesAnalytics, getRevenueAnalytics, getSummaryAnalytics, getTopProductsAnalytics } from '../../REDUX/SLICES/analyticsSlice';
import { getProducts } from '../../REDUX/SLICES/productSlice';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { summaryAnalytics, topProducts, loading: analyticsLoading } = useSelector((state) => state.analytics);
    const { products } = useSelector((state) => state.product);

    const [timeRange, setTimeRange] = useState('7days');

    useEffect(() => {
        dispatch(getSummaryAnalytics());
        dispatch(getTopProductsAnalytics(5));
        dispatch(getProducts());
    }, [dispatch]);

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${(summaryAnalytics?.totalRevenue || 0).toLocaleString('en-IN')}`,
            icon: '💰',
            color: 'bg-green-50',
            trend: '+12.5%'
        },
        {
            title: 'Total Orders',
            value: summaryAnalytics?.totalOrders || 0,
            icon: '📦',
            color: 'bg-blue-50',
            trend: '+8.2%'
        },
        {
            title: 'Total Profit',
            value: `₹${(summaryAnalytics?.totalProfit || 0).toLocaleString('en-IN')}`,
            icon: '📈',
            color: 'bg-purple-50',
            trend: '+15.3%'
        },
        {
            title: 'Active Products',
            value: products?.length || 0,
            icon: '📦',
            color: 'bg-orange-50',
            trend: '+5 new'
        },
        {
            title: 'Total Customers',
            value: summaryAnalytics?.totalCustomers || 0,
            icon: '👥',
            color: 'bg-pink-50',
            trend: '+20 new'
        },
        {
            title: 'Pending Orders',
            value: summaryAnalytics?.pendingOrders || 0,
            icon: '⏳',
            color: 'bg-yellow-50',
            trend: 'Needs action'
        }
    ];

    const TIME_LABELS = {
    '24hrs': '24 Hours',
    '7days': '7 Days',
    '30days': '30 Days',
    '90days': '90 Days',
    'all': 'All Time'
};

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900">📊 Seller Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your business overview</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Time Range Selector */}
                <div className="mb-6 flex gap-2 flex-wrap">
    {['24hrs', '7days', '30days', '90days', 'all'].map((range) => (
        <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
                timeRange === range
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
        >
            {TIME_LABELS[range]}
        </button>
    ))}
</div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`${stat.color} rounded-lg p-6 shadow hover:shadow-lg transition`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <span className="text-4xl">{stat.icon}</span>
                            </div>
                            <p className="text-sm text-green-600 font-semibold">{stat.trend}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Sales Overview */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">📈 Sales Overview</h2>
                                <Link to="/seller/analytics" className="text-teal-600 hover:underline font-semibold">
                                    View Details →
                                </Link>
                            </div>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <p className="text-gray-500">📊 Chart will display here</p>
                            </div>
                        </div>

                        {/* Revenue Trend */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">💹 Revenue Trend</h2>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <p className="text-gray-500">📊 Chart will display here</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold mb-4">⚡ Quick Actions</h2>
                            <div className="space-y-3">
                                <Link 
                                    to="/seller/products/create"
                                    className="block w-full bg-teal-600 text-white text-center py-2 rounded-lg hover:bg-teal-700 transition font-semibold"
                                >
                                    ➕ Add New Product
                                </Link>
                                <Link 
                                    to="/seller/orders"
                                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                                >
                                    📦 View Orders
                                </Link>
                                <Link 
                                    to="/seller/inventory"
                                    className="block w-full bg-orange-600 text-white text-center py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
                                >
                                    📊 Manage Inventory
                                </Link>
                                <Link 
                                    to="/seller/analytics"
                                    className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                                >
                                    📈 Full Analytics
                                </Link>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold mb-4">🏆 Top 5 Products</h2>
                            <div className="space-y-3">
                                {topProducts?.slice(0, 5).map((product, idx) => (
                                    <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-900 line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.totalSold} sold</p>
                                        </div>
                                        <p className="font-bold text-teal-600">₹{product.revenue?.toLocaleString('en-IN') || 0}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold mb-4">🔔 Recent Activity</h2>
                            <div className="space-y-3">
                                <div className="flex gap-3 pb-3 border-b">
                                    <span className="text-2xl">📦</span>
                                    <div>
                                        <p className="text-sm font-semibold">New order received</p>
                                        <p className="text-xs text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 pb-3 border-b">
                                    <span className="text-2xl">⭐</span>
                                    <div>
                                        <p className="text-sm font-semibold">Product review added</p>
                                        <p className="text-xs text-gray-500">15 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <p className="text-sm font-semibold">Customer inquiry</p>
                                        <p className="text-xs text-gray-500">1 hour ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;