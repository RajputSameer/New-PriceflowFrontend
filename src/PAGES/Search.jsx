import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts, clearError, clearMessage } from '../REDUX/SLICES/productSlice';

const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const query = searchParams.get('q') || '';
    const [sortBy, setSortBy] = useState('relevance');
    const [priceRange, setPriceRange] = useState([0, 100000]);  // ✅ Array [min, max]
    
    // Redux state
    const { products = [], loading, error, message } = useSelector((state) => state.product);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // ✅ Clear error/message on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearMessage());
        };
    }, [dispatch]);

    // ✅ Search when query changes
    useEffect(() => {
        if (query.trim()) {
            console.log('🔍 Searching for:', query);
            dispatch(searchProducts(query));
        }
    }, [query, dispatch]);

    // ✅ Sort products based on selection
    const getSortedProducts = () => {
        if (!products || !Array.isArray(products)) {
            console.warn('⚠️ Products is not an array:', products);
            return [];
        }

        let sorted = [...products];
        
        switch(sortBy) {
            case 'price-low-to-high':
                return sorted.sort((a, b) => (a.pricing?.sellingPrice || 0) - (b.pricing?.sellingPrice || 0));
            case 'price-high-to-low':
                return sorted.sort((a, b) => (b.pricing?.sellingPrice || 0) - (a.pricing?.sellingPrice || 0));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'rating':
                return sorted.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
            case 'popularity':
                return sorted.sort((a, b) => (b.metrics?.totalSold || 0) - (a.metrics?.totalSold || 0));
            default:
                return sorted;
        }
    };

    // ✅ FIX 1: Filter products by price range - USE ARRAY PROPERLY
    const getFilteredProducts = () => {
        return getSortedProducts().filter(product => {
            const price = product.pricing?.sellingPrice || 0;
            return price >= priceRange && price <= priceRange;  // ✅ FIXED: Array access
        });
    };

    const filteredProducts = getFilteredProducts();

    // ✅ Debug logging
    useEffect(() => {
        console.log('📊 Search State:', {
            query,
            loading,
            error,
            priceRange,  // ✅ Added to debug
            productsCount: products?.length || 0,
            filteredCount: filteredProducts?.length || 0,
            products: products
        });
    }, [query, loading, error, products, filteredProducts, priceRange]);

    // ✅ Handle Buy Now
    const handleBuyNow = (product) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout', {
            state: {
                quickBuyProduct: {
                    _id: product._id,
                    name: product.name,
                    price: product.pricing?.sellingPrice || 0,
                    quantity: 1,
                    image: product.images?.secure_url  // ✅ FIX 4: Array access
                }
            }
        });
    };

    // ✅ Handle product click
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Search Results for "<span className="text-teal-600">{query}</span>"
                    </h1>
                    <p className="text-gray-600">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Searching for "{query}"...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-6">
                        ⚠️ Error: {error}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                        <p className="text-gray-600 mb-6">
                            We couldn't find any products matching "<span className="font-semibold">{query}</span>"
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Try:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Check your spelling</li>
                                <li>• Try using different keywords</li>
                                <li>• Try more general terms</li>
                                <li>• Try fewer words</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* ============ SIDEBAR FILTERS ============ */}
                        <div className="hidden md:block">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>

                                {/* Sort By */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="price-low-to-high">Price: Low to High</option>
                                        <option value="price-high-to-low">Price: High to Low</option>
                                        <option value="newest">Newest</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="popularity">Most Popular</option>
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-600">Min: ₹{priceRange.toLocaleString()}</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100000"
                                                value={priceRange}  // ✅ FIX 3a: Use priceRange
                                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange])}  // ✅ FIX 3b: Set [newMin, oldMax]
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600">Max: ₹{priceRange.toLocaleString()}</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100000"
                                                value={priceRange}  // ✅ FIX 3c: Use priceRange
                                                onChange={(e) => setPriceRange([priceRange, parseInt(e.target.value)])}  // ✅ FIX 3d: Set [oldMin, newMax]
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Stats */}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                        Showing {filteredProducts.length} of {products?.length || 0} products
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ============ PRODUCTS GRID ============ */}
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition h-full flex flex-col cursor-pointer group"
                                        onClick={() => handleProductClick(product._id)}
                                    >
                                        {/* Product Image */}
                                        <div className="relative overflow-hidden bg-gray-100 h-56">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images.secure_url}  // ✅ FIX 2: Use  to access first image
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    📦
                                                </div>
                                            )}
                                            
                                            {/* Stock Badge */}
                                            {product.stock?.available <= 0 && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <span className="text-white font-bold">Out of Stock</span>
                                                </div>
                                            )}

                                            {/* Discount Badge */}
                                            {product.pricing?.discountPercentage > 0 && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                                    -{product.pricing.discountPercentage}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-3 flex flex-col flex-1">
                                            {/* Product Name */}
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                                                {product.name}
                                            </h3>

                                            {/* SKU */}
                                            <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {product.ratings?.average?.toFixed(1) || 0}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ({product.ratings?.totalReviews || 0})
                                                </span>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-teal-600">
                                                        ₹{(product.pricing?.sellingPrice || 0).toLocaleString('en-IN')}
                                                    </span>
                                                    {product.pricing?.regularPrice > product.pricing?.sellingPrice && (
                                                        <span className="text-sm line-through text-gray-500">
                                                            ₹{(product.pricing?.regularPrice || 0).toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Stock Status */}
                                            <div className="mb-3">
                                                {product.stock?.available > 0 ? (
                                                    <span className="text-xs text-green-600 font-semibold">
                                                        ✅ In Stock ({product.stock.available})
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-red-600 font-semibold">
                                                        ❌ Out of Stock
                                                    </span>
                                                )}
                                            </div>

                                            {/* Buy Now Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBuyNow(product);
                                                }}
                                                disabled={product.stock?.available === 0}
                                                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition font-medium text-sm mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                💳 Buy Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
