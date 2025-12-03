
// ✅ SELLER: src/pages/seller/SellerPayments.jsx
// Payment details and transaction history

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRevenueAnalytics } from '../../REDUX/SLICES/analyticsSlice';

const SellerPayments = () => {
    const dispatch = useDispatch();
    const { revenueAnalytics } = useSelector((state) => state.analytics);
    
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        dispatch(getRevenueAnalytics());
    }, [dispatch]);

    const payments = [
        { id: 1, date: '2024-12-01', amount: 25000, method: 'Bank Transfer', status: 'completed', ordersCount: 45 },
        { id: 2, date: '2024-11-28', amount: 18500, method: 'Bank Transfer', status: 'completed', ordersCount: 32 },
        { id: 3, date: '2024-11-21', amount: 32000, method: 'Bank Transfer', status: 'completed', ordersCount: 58 },
        { id: 4, date: '2024-11-14', amount: 15000, method: 'Bank Transfer', status: 'pending', ordersCount: 28 },
        { id: 5, date: '2024-11-07', amount: 22000, method: 'Bank Transfer', status: 'completed', ordersCount: 42 },
    ];

    const sortedPayments = [...payments].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        return 0;
    });

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900">💳 Payments</h1>
                    <p className="text-gray-600 mt-1">Track your earnings and payment history</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">₹{totalEarnings.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 mt-2">All time</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Completed Payments</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{completedPayments}</p>
                        <p className="text-xs text-gray-500 mt-2">Successfully paid</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingPayments}</p>
                        <p className="text-xs text-gray-500 mt-2">Awaiting payout</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Avg Per Payout</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">₹{Math.round(totalEarnings / payments.length).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 mt-2">Average amount</p>
                    </div>
                </div>

                {/* Sort & Filter */}
                <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
                    <p className="font-semibold text-gray-900">Payment History</p>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="newest">Newest First</option>
                        <option value="highest">Highest Amount</option>
                        <option value="lowest">Lowest Amount</option>
                    </select>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Payout Date</th>
                                    <th className="px-6 py-4 text-right font-bold">Amount</th>
                                    <th className="px-6 py-4 text-center font-bold">Orders</th>
                                    <th className="px-6 py-4 text-center font-bold">Payment Method</th>
                                    <th className="px-6 py-4 text-center font-bold">Status</th>
                                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPayments.map((payment) => (
                                    <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {new Date(payment.date).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-teal-600 text-lg">
                                            ₹{payment.amount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">{payment.ordersCount}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{payment.method}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                payment.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {payment.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-blue-600 hover:underline font-semibold text-xs">
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-blue-900 mb-4">ℹ️ Payment Information</h2>
                    <div className="space-y-3 text-sm text-blue-800">
                        <p>✅ Payouts are processed every week on Mondays</p>
                        <p>✅ Minimum payout threshold: ₹1,000</p>
                        <p>✅ 2% transaction fee applies to each payout</p>
                        <p>✅ GST (18%) will be deducted from earnings</p>
                        <p>✅ Bank transfer typically takes 2-3 business days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPayments;
