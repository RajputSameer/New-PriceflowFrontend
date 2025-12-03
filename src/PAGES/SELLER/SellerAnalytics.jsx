// ✅ SELLER: src/pages/seller/SellerAnalytics.jsx
// Complete analytics and reporting

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    getSalesAnalytics, 
    getRevenueAnalytics, 
    getProfitAnalytics,
    getCustomerAnalytics 
} from '../../REDUX/SLICES/analyticsSlice';

const SellerAnalytics = () => {
    const dispatch = useDispatch();
    const { 
        salesAnalytics, 
        revenueAnalytics, 
        profitAnalytics,
        customerAnalytics,
        loading 
    } = useSelector((state) => state.analytics);
    
    const [timeRange, setTimeRange] = useState('30days');

    useEffect(() => {
        dispatch(getSalesAnalytics({ range: timeRange }));
        dispatch(getRevenueAnalytics({ range: timeRange }));
        dispatch(getProfitAnalytics({ range: timeRange }));
        dispatch(getCustomerAnalytics({ range: timeRange }));
    }, [dispatch, timeRange]);

    const analyticsCards = [
        {
            title: 'Total Sales',
            value: `₹${(salesAnalytics?.total || 0).toLocaleString('en-IN')}`,
            icon: '💳',
            trend: `+${salesAnalytics?.growth || 0}%`,
            color: 'bg-blue-50'
        },
        {
            title: 'Total Revenue',
            value: `₹${(revenueAnalytics?.total || 0).toLocaleString('en-IN')}`,
            icon: '💰',
            trend: `+${revenueAnalytics?.growth || 0}%`,
            color: 'bg-green-50'
        },
        {
            title: 'Total Profit',
            value: `₹${(profitAnalytics?.total || 0).toLocaleString('en-IN')}`,
            icon: '📈',
            trend: `+${profitAnalytics?.growth || 0}%`,
            color: 'bg-purple-50'
        },
        {
            title: 'New Customers',
            value: customerAnalytics?.newCustomers || 0,
            icon: '👥',
            trend: `+${customerAnalytics?.growth || 0}%`,
            color: 'bg-pink-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900">📊 Analytics</h1>
                    <p className="text-gray-600 mt-1">Detailed business insights and reports</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Time Range Selector */}
                <div className="mb-6 flex gap-2 bg-white rounded-lg shadow p-4 w-fit">
                    {['7days', '30days', '90days', '1year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                timeRange === range
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {range === '7days' && '7 Days'}
                            {range === '30days' && '30 Days'}
                            {range === '90days' && '90 Days'}
                            {range === '1year' && '1 Year'}
                        </button>
                    ))}
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {analyticsCards.map((card, idx) => (
                        <div key={idx} className={`${card.color} rounded-lg p-6 shadow hover:shadow-lg transition`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                                    <p className="text-sm text-green-600 font-semibold mt-2">{card.trend}</p>
                                </div>
                                <span className="text-4xl">{card.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">📈 Sales Trend</h2>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <p className="text-gray-500">📊 Chart visualization here</p>
                        </div>
                    </div>

                    {/* Revenue Distribution */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">💹 Revenue Distribution</h2>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <p className="text-gray-500">📊 Chart visualization here</p>
                        </div>
                    </div>

                    {/* Customer Growth */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">👥 Customer Growth</h2>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <p className="text-gray-500">📊 Chart visualization here</p>
                        </div>
                    </div>

                    {/* Profit Margin */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">📊 Profit Margin</h2>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <p className="text-gray-500">📊 Chart visualization here</p>
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6">📋 Detailed Report</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Metric</th>
                                    <th className="px-6 py-4 text-right font-bold">Value</th>
                                    <th className="px-6 py-4 text-right font-bold">Previous</th>
                                    <th className="px-6 py-4 text-right font-bold">Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold">Total Orders</td>
                                    <td className="px-6 py-4 text-right">{salesAnalytics?.totalOrders || 0}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{salesAnalytics?.previousOrders || 0}</td>
                                    <td className="px-6 py-4 text-right text-green-600 font-semibold">+{(salesAnalytics?.totalOrders - salesAnalytics?.previousOrders) || 0}</td>
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold">Avg Order Value</td>
                                    <td className="px-6 py-4 text-right">₹{(salesAnalytics?.avgOrderValue || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">₹{(salesAnalytics?.prevAvgOrderValue || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-right text-green-600 font-semibold">+{((salesAnalytics?.avgOrderValue - salesAnalytics?.prevAvgOrderValue) / salesAnalytics?.prevAvgOrderValue * 100).toFixed(1)}%</td>
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold">Conversion Rate</td>
                                    <td className="px-6 py-4 text-right">{(salesAnalytics?.conversionRate || 0).toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{(salesAnalytics?.prevConversionRate || 0).toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-right text-green-600 font-semibold">+{((salesAnalytics?.conversionRate - salesAnalytics?.prevConversionRate)).toFixed(2)}%</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold">Profit Margin</td>
                                    <td className="px-6 py-4 text-right">{(profitAnalytics?.marginPercentage || 0).toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{(profitAnalytics?.prevMargin || 0).toFixed(2)}%</td>
                                    <td className="px-6 py-4 text-right text-green-600 font-semibold">+{((profitAnalytics?.marginPercentage - profitAnalytics?.prevMargin)).toFixed(2)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAnalytics;
