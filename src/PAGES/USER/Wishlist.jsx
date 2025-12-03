// ✅ src/pages/user/Wishlist.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist, addToWishlist } from '../../REDUX/SLICES/userSlice';

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wishlist, loading, error } = useSelector((state) => state.user);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [sortBy, setSortBy] = useState('latest');
    const [filterPrice, setFilterPrice] = useState('all');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        dispatch(getWishlist());
    }, [dispatch, isAuthenticated, navigate]);

    const handleRemoveFromWishlist = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    const handleAddToCart = (productId) => {
        // Add to cart logic here
        console.log('Adding to cart:', productId);
    };

    // Filter products based on price
    const getFilteredProducts = () => {
        let filtered = [...(wishlist || [])];

        if (filterPrice !== 'all') {
            const [min, max] = filterPrice.split('-').map(Number);
            filtered = filtered.filter(product => {
                const price = product.pricing?.sellingPrice || 0;
                return max ? price >= min && price <= max : price >= min;
            });
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.pricing?.sellingPrice || 0) - (b.pricing?.sellingPrice || 0);
                case 'price-high':
                    return (b.pricing?.sellingPrice || 0) - (a.pricing?.sellingPrice || 0);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'latest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    };

    const filteredProducts = getFilteredProducts();
    const totalPrice = (wishlist || []).reduce((sum, product) => {
        return sum + (product.pricing?.sellingPrice || 0);
    }, 0);

    return (
        <div className="min-h-screen bg-yellow-50 py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">❤️ My Wishlist</h1>
                    <p className="text-gray-600">
                        {wishlist?.length || 0} product{wishlist?.length !== 1 ? 's' : ''} saved
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse h-80">
                                <div className="bg-gray-200 h-48"></div>
                                <div className="p-4 space-y-2">
                                    <div className="bg-gray-200 h-4 rounded"></div>
                                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && (!wishlist || wishlist.length === 0) && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">💭</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">
                            Start adding products to your wishlist to save them for later!
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {/* Content */}
                {!loading && wishlist && wishlist.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Products Grid */}
                        <div className="lg:col-span-3">
                            {/* Filters & Sort */}
                            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Sort */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Sort By
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="latest">Latest Added</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="name">Product Name</option>
                                        </select>
                                    </div>

                                    {/* Price Filter */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Filter by Price
                                        </label>
                                        <select
                                            value={filterPrice}
                                            onChange={(e) => setFilterPrice(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        >
                                            <option value="all">All Prices</option>
                                            <option value="0-10000">Under ₹10,000</option>
                                            <option value="10000-50000">₹10,000 - ₹50,000</option>
                                            <option value="50000-100000">₹50,000 - ₹100,000</option>
                                            <option value="100000">Above ₹100,000</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* No filtered results */}
                            {filteredProducts.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <p className="text-gray-600 text-lg">No products match your filters</p>
                                </div>
                            ) : (
                                /* Products Grid */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                                        >
                                            {/* Product Image */}
                                            <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 flex items-center justify-center text-4xl relative">
                                                📦
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                                    className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                                                    title="Remove from wishlist"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            {/* Product Details */}
                                            <div className="p-4">
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-teal-600">
                                                        {product.name}
                                                    </h3>
                                                </Link>

                                                {/* Description */}
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                    {product.description}
                                                </p>

                                                {/* Seller Info */}
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Seller: {product.seller?.fullName || 'Unknown'}
                                                </p>

                                                {/* Pricing */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <div>
                                                        <span className="text-lg font-bold text-teal-600">
                                                            ₹{product.pricing?.sellingPrice || 0}
                                                        </span>
                                                        {product.pricing?.regularPrice > product.pricing?.sellingPrice && (
                                                            <span className="text-xs text-gray-500 line-through ml-2">
                                                                ₹{product.pricing?.regularPrice}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {product.pricing?.discountPercentage > 0 && (
                                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                                                            {product.pricing?.discountPercentage}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock Status */}
                                                <div className="mb-3">
                                                    {product.stock?.available > 0 ? (
                                                        <p className="text-xs text-green-600 font-semibold">
                                                            ✅ In Stock ({product.stock?.available})
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-red-600 font-semibold">
                                                            ❌ Out of Stock
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="text-xs text-gray-500 space-y-1 mb-4">
                                                    {product.warranty && (
                                                        <p>🛡️ {product.warranty.period} {product.warranty.unit} warranty</p>
                                                    )}
                                                    {product.returnPolicy?.returnable && (
                                                        <p>↩️ {product.returnPolicy?.returnDays} days return</p>
                                                    )}
                                                </div>

                                                {/* Rating */}
                                                <div className="mb-4">
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                                                        ⭐ {product.ratings?.average || 0} ({product.ratings?.totalReviews || 0} reviews)
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleAddToCart(product._id)}
                                                        disabled={product.stock?.available === 0}
                                                        className="w-full bg-teal-600 text-white py-2 rounded font-medium text-sm hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        🛒 Add to Cart
                                                    </button>
                                                    <Link
                                                        to={`/product/${product._id}`}
                                                        className="w-full bg-gray-200 text-gray-900 py-2 rounded font-medium text-sm hover:bg-gray-300 transition text-center"
                                                    >
                                                        👁️ View
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>

                                {/* Stats */}
                                <div className="space-y-3 mb-6 border-b border-gray-200 pb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Products</span>
                                        <span className="font-semibold text-gray-900">
                                            {wishlist?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Value</span>
                                        <span className="font-bold text-teal-600 text-lg">
                                            ₹{totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Average Price */}
                                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                                    <p className="text-xs text-gray-600 mb-1">Average Price</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{Math.round(totalPrice / (wishlist?.length || 1)).toLocaleString()}
                                    </p>
                                </div>

                                {/* In Stock Items */}
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    {(() => {
                                        const inStock = (wishlist || []).filter(p => p.stock?.available > 0).length;
                                        return (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">In Stock</span>
                                                <span className="font-semibold text-green-600">
                                                    {inStock} / {wishlist?.length || 0}
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Add All to Cart Button */}
                                <button
                                    onClick={() => {
                                        (wishlist || []).forEach(product => {
                                            if (product.stock?.available > 0) {
                                                handleAddToCart(product._id);
                                            }
                                        });
                                    }}
                                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition mb-3"
                                >
                                    🛒 Add All to Cart
                                </button>

                                {/* Continue Shopping Button */}
                                <Link
                                    to="/"
                                    className="block w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Share Wishlist */}
                                <button className="w-full mt-4 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                                    📤 Share Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
