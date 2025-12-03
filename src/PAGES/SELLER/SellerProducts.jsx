// ✅ SELLER: src/pages/seller/SellerProducts.jsx
// Manage seller products with create, edit, delete

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../REDUX/SLICES/productSlice';

const SellerProducts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.product);
    
    const [filters, setFilters] = useState({ status: 'all', search: '' });
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(productId));
        }
    };

    const filteredProducts = products?.filter(p => {
        const matchesStatus = filters.status === 'all' || 
            (filters.status === 'active' && p.isActive) ||
            (filters.status === 'inactive' && !p.isActive);
        const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'price-high') return b.pricing.sellingPrice - a.pricing.sellingPrice;
        if (sortBy === 'price-low') return a.pricing.sellingPrice - b.pricing.sellingPrice;
        if (sortBy === 'stock-high') return b.stock.available - a.stock.available;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">📦 Products</h1>
                        <p className="text-gray-600 mt-1">Manage your product catalog</p>
                    </div>
                    <Link 
                        to="/seller/products/create"
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold flex items-center gap-2"
                    >
                        ➕ Add Product
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Filters & Search */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="stock-high">Stock: High to Low</option>
                        </select>
                        <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold">
                            🔄 Reset
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                )}

                {/* Products Table */}
                {!loading && sortedProducts?.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-gray-900">Product Name</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-900">SKU</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-900">Price</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-900">Stock</th>
                                        <th className="px-6 py-4 text-center font-bold text-gray-900">Rating</th>
                                        <th className="px-6 py-4 text-center font-bold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-center font-bold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedProducts.map((product) => (
                                        <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.category?.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                                            <td className="px-6 py-4 text-right font-bold text-teal-600">
                                                ₹{product.pricing.sellingPrice?.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    product.stock.available > 0 
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {product.stock.available}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">⭐ {product.ratings?.average || 0}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    product.isActive 
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {product.isActive ? '✅ Active' : '❌ Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center flex justify-center gap-2">
                                                <Link 
                                                    to={`/seller/products/${product._id}/edit`}
                                                    className="text-blue-600 hover:underline text-sm font-semibold"
                                                >
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-red-600 hover:underline text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && (!sortedProducts || sortedProducts.length === 0) && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">Start by creating your first product</p>
                        <Link 
                            to="/seller/products/create"
                            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                        >
                            ➕ Create Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerProducts;
