// ✅ SELLER: src/pages/seller/SellerInventory.jsx
// Manage inventory and stock

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, updateProductStock } from '../../REDUX/SLICES/productSlice';

const SellerInventory = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.product);
    
    const [filters, setFilters] = useState({ status: 'all', search: '' });
    const [editingId, setEditingId] = useState(null);
    const [newStock, setNewStock] = useState({});

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const filteredProducts = products?.filter(p => {
        const matchesStatus = filters.status === 'all' || 
            (filters.status === 'low' && p.stock.available < p.stock.reorderLevel) ||
            (filters.status === 'out' && p.stock.available === 0);
        const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleUpdateStock = (productId) => {
        if (newStock[productId] !== undefined) {
            dispatch(updateProductStock({
                productId,
                quantity: newStock[productId]
            }));
            setEditingId(null);
            setNewStock({});
        }
    };

    const lowStockProducts = products?.filter(p => p.stock.available < p.stock.reorderLevel).length || 0;
    const outOfStockProducts = products?.filter(p => p.stock.available === 0).length || 0;
    const totalValue = products?.reduce((sum, p) => sum + (p.stock.available * p.pricing.costPrice), 0) || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900">📊 Inventory</h1>
                    <p className="text-gray-600 mt-1">Manage your stock levels</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Products</p>
                        <p className="text-4xl font-bold text-gray-900 mt-2">{products?.length || 0}</p>
                        <p className="text-xs text-gray-500 mt-2">Active in inventory</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Low Stock</p>
                        <p className="text-4xl font-bold text-yellow-600 mt-2">{lowStockProducts}</p>
                        <p className="text-xs text-yellow-700 mt-2">Below reorder level</p>
                    </div>
                    <div className="bg-red-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
                        <p className="text-4xl font-bold text-red-600 mt-2">{outOfStockProducts}</p>
                        <p className="text-xs text-red-700 mt-2">Zero quantity</p>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium">Total Value</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">₹{totalValue.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-green-700 mt-2">Inventory value</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Stock Status</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Product Name</th>
                                    <th className="px-6 py-4 text-right font-bold">Stock</th>
                                    <th className="px-6 py-4 text-right font-bold">Reorder Level</th>
                                    <th className="px-6 py-4 text-right font-bold">Reserved</th>
                                    <th className="px-6 py-4 text-right font-bold">Cost</th>
                                    <th className="px-6 py-4 text-center font-bold">Status</th>
                                    <th className="px-6 py-4 text-center font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((product) => (
                                    <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-semibold text-gray-900 max-w-xs truncate">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {editingId === product._id ? (
                                                <input
                                                    type="number"
                                                    value={newStock[product._id] || product.stock.available}
                                                    onChange={(e) => setNewStock({ ...newStock, [product._id]: parseInt(e.target.value) })}
                                                    className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            ) : (
                                                <span className="font-bold text-gray-900">{product.stock.available}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">{product.stock.reorderLevel}</td>
                                        <td className="px-6 py-4 text-right text-gray-600">{product.stock.reserved}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-teal-600">
                                            ₹{product.pricing.costPrice}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                product.stock.available === 0 
                                                    ? 'bg-red-100 text-red-700'
                                                    : product.stock.available < product.stock.reorderLevel
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {product.stock.available === 0 && '❌ Out'}
                                                {product.stock.available < product.stock.reorderLevel && product.stock.available > 0 && '⚠️ Low'}
                                                {product.stock.available >= product.stock.reorderLevel && '✅ OK'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {editingId === product._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStock(product._id)}
                                                        className="text-green-600 hover:underline font-semibold text-xs mr-2"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-red-600 hover:underline font-semibold text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingId(product._id)}
                                                    className="text-blue-600 hover:underline font-semibold text-xs"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerInventory;
