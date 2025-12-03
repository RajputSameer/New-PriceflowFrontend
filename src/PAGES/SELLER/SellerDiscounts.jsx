// ✅ SELLER: src/pages/seller/SellerDiscounts.jsx
// Create and manage discount campaigns

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDiscounts, createDiscount, deleteDiscount } from '../../REDUX/SLICES/discountSlice';

const SellerDiscounts = () => {
    const dispatch = useDispatch();
    const { discounts, loading } = useSelector((state) => state.discount);
    
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ status: 'all' });
    const [formData, setFormData] = useState({
        code: '',
        value: '',
        description: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        minOrderValue: '',
        applicableProducts: [],
        usageLimit: '',
        maxDiscount: ''
    });

    useEffect(() => {
        dispatch(getDiscounts());
    }, [dispatch]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createDiscount(formData));
        setFormData({
            code: '',
            value: '',
            description: '',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: '',
            minOrderValue: '',
            applicableProducts: [],
            usageLimit: '',
            maxDiscount: ''
        });
        setShowForm(false);
    };

    const filteredDiscounts = discounts?.filter(d => {
        if (filters.status === 'active') {
            return new Date(d.validUntil) > new Date();
        }
        if (filters.status === 'expired') {
            return new Date(d.validUntil) <= new Date();
        }
        return true;
    });

    const activeCount = discounts?.filter(d => new Date(d.validUntil) > new Date()).length || 0;
    const expiredCount = discounts?.filter(d => new Date(d.validUntil) <= new Date()).length || 0;
    const totalUses = discounts?.reduce((sum, d) => sum + (d.usageCount || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">🎟️ Discounts</h1>
                        <p className="text-gray-600 mt-1">Create and manage discount campaigns</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                    >
                        ➕ Create Discount
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Active Discounts</p>
                        <p className="text-4xl font-bold text-green-600 mt-2">{activeCount}</p>
                        <p className="text-xs text-gray-500 mt-2">Currently running</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Expired Discounts</p>
                        <p className="text-4xl font-bold text-gray-600 mt-2">{expiredCount}</p>
                        <p className="text-xs text-gray-500 mt-2">Ended campaigns</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Uses</p>
                        <p className="text-4xl font-bold text-blue-600 mt-2">{totalUses}</p>
                        <p className="text-xs text-gray-500 mt-2">All time</p>
                    </div>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Create New Discount</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="Discount Code (e.g. SAVE20)"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                                <input
                                    type="number"
                                    name="value"
                                    placeholder="Discount % (e.g. 20)"
                                    value={formData.value}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                                <input
                                    type="date"
                                    name="validFrom"
                                    value={formData.validFrom}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="date"
                                    name="validUntil"
                                    placeholder="Valid Until"
                                    value={formData.validUntil}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                                <input
                                    type="number"
                                    name="minOrderValue"
                                    placeholder="Min Order Value (Optional)"
                                    value={formData.minOrderValue}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="number"
                                    name="maxDiscount"
                                    placeholder="Max Discount Amount (Optional)"
                                    value={formData.maxDiscount}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <textarea
                                name="description"
                                placeholder="Discount Description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                rows="2"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition font-semibold"
                                >
                                    Create Discount
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-2">
                    {['all', 'active', 'expired'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilters({ ...filters, status })}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                filters.status === status
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {status === 'all' && 'All'}
                            {status === 'active' && 'Active'}
                            {status === 'expired' && 'Expired'}
                        </button>
                    ))}
                </div>

                {/* Discounts Grid */}
                {filteredDiscounts?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDiscounts.map((discount) => {
                            const isActive = new Date(discount.validUntil) > new Date();
                            return (
                                <div key={discount._id} className={`${isActive ? 'bg-white' : 'bg-gray-100'} rounded-lg shadow p-6 hover:shadow-lg transition`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Code</p>
                                            <p className="text-2xl font-bold text-teal-600 font-mono">{discount.code}</p>
                                        </div>
                                        <span className="text-4xl font-bold text-red-600">{discount.value}%</span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">{discount.description}</p>

                                    <div className="space-y-2 mb-4 text-sm">
                                        <p className="text-gray-600">
                                            📅 Until: {new Date(discount.validUntil).toLocaleDateString('en-IN')}
                                        </p>
                                        <p className="text-gray-600">
                                            🎯 Used: {discount.usageCount || 0} times
                                        </p>
                                        {discount.minOrderValue && (
                                            <p className="text-gray-600">
                                                💰 Min: ₹{discount.minOrderValue}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold text-sm">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => dispatch(deleteDiscount(discount._id))}
                                            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-semibold text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">🎟️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No discounts found</h3>
                        <p className="text-gray-600 mb-6">Create your first discount campaign to get started</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                        >
                            ➕ Create Discount
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDiscounts;
