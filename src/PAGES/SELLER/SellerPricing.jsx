// ✅ SELLER: src/pages/seller/SellerPricing.jsx
// Manage product pricing and discounts

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, updateProductPrice } from '../../REDUX/SLICES/productSlice';
import { getDiscounts } from '../../REDUX/SLICES/discountSlice';

const SellerPricing = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.product);
    const { discounts } = useSelector((state) => state.discount);
    
    const [editingId, setEditingId] = useState(null);
    const [priceData, setPriceData] = useState({});

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getDiscounts());
    }, [dispatch]);

    const handleUpdatePrice = (productId) => {
        if (priceData[productId]) {
            dispatch(updateProductPrice({
                productId,
                data: priceData[productId]
            }));
            setEditingId(null);
        }
    };

    const calculateMetrics = (costPrice, sellingPrice) => {
        const margin = sellingPrice - costPrice;
        const marginPercentage = (margin / costPrice) * 100;
        return { margin, marginPercentage };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900">💰 Pricing & Discounts</h1>
                    <p className="text-gray-600 mt-1">Manage your pricing strategy</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Avg Cost Price</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            ₹{(products?.reduce((sum, p) => sum + p.pricing.costPrice, 0) / (products?.length || 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Avg Selling Price</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            ₹{(products?.reduce((sum, p) => sum + p.pricing.sellingPrice, 0) / (products?.length || 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Avg Margin</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">
                            {((products?.reduce((sum, p) => sum + ((p.pricing.sellingPrice - p.pricing.costPrice) / p.pricing.costPrice), 0) / (products?.length || 1)) * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Pricing Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Product</th>
                                    <th className="px-6 py-4 text-right font-bold">Cost Price</th>
                                    <th className="px-6 py-4 text-right font-bold">Regular Price</th>
                                    <th className="px-6 py-4 text-right font-bold">Selling Price</th>
                                    <th className="px-6 py-4 text-right font-bold">Discount</th>
                                    <th className="px-6 py-4 text-right font-bold">Margin</th>
                                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((product) => {
                                    const metrics = calculateMetrics(product.pricing.costPrice, product.pricing.sellingPrice);
                                    return (
                                        <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-semibold text-gray-900 max-w-xs truncate">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 text-right">₹{product.pricing.costPrice.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">₹{product.pricing.regularPrice?.toLocaleString('en-IN') || 'N/A'}</td>
                                            <td className="px-6 py-4 text-right font-bold text-teal-600">
                                                ₹{product.pricing.sellingPrice.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {product.pricing.discountPercentage > 0 ? (
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                                                        -{product.pricing.discountPercentage}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`font-bold ${metrics.marginPercentage > 30 ? 'text-green-600' : metrics.marginPercentage > 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {metrics.marginPercentage.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setEditingId(product._id)}
                                                    className="text-blue-600 hover:underline font-semibold text-xs"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Active Discounts */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6">🎟️ Active Discounts</h2>
                    {discounts?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {discounts.map((discount) => (
                                <div key={discount._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-lg text-red-600">{discount.value}% OFF</span>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">Code: <span className="font-mono font-bold">{discount.code}</span></p>
                                    <p className="text-xs text-gray-500">Valid until: {new Date(discount.validUntil).toLocaleDateString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No active discounts</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerPricing;

