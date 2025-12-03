import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, clearError, clearMessage } from '../../REDUX/SLICES/productSlice';
import { addToWishlist } from '../../REDUX/SLICES/userSlice';

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedProduct, loading, error, message } = useSelector((state) => state.product);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [mainImage, setMainImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSpecs, setSelectedSpecs] = useState({});
    const [activeTab, setActiveTab] = useState('overview');
const [isBuying, setIsBuying] = useState(false);

    // ✅ Fetch product on mount
    useEffect(() => {
        if (productId) {
            dispatch(getProductById(productId));
        }
    }, [productId, dispatch]);

    // ✅ Set main image
    useEffect(() => {
        if (selectedProduct?.product?.images && selectedProduct.product.images.length > 0) {
            setMainImage(selectedProduct.product.images);  // ← Set FIRST image
        }
    }, [selectedProduct]);
 // Handle Buy Now (Direct Checkout)
   const handleBuyNow = () => {
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }

    setIsBuying(true);

    // Navigate to checkout with product details
    navigate('/checkout', { 
        state: { 
            quickBuyProduct: {
                _id: product._id,
                name: product.name,
                price: product.pricing.sellingPrice,
                quantity: quantity,
                image: product.images?.secure_url
            }
        } 
    });
};

    // ✅ Clear messages
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                if (error) dispatch(clearError());
                if (message) dispatch(clearMessage());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, message, dispatch]);

    // ✅ Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    // ✅ No product found
    if (!selectedProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Product not found</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        ← Back to Products
                    </button>
                </div>
            </div>
        );
    }

   // ✅ FIXED: Proper null check
const product = selectedProduct?.product;

// ✅ Only calculate if product exists
const discountPercent = product ? Math.round(
    ((product.pricing.regularPrice - product.pricing.sellingPrice) / product.pricing.regularPrice) * 100
) : 0;


    // ✅ Handle add to cart
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Adding to cart:', { productId: product._id, quantity, specs: selectedSpecs });
        // TODO: Implement add to cart action
        alert(`Added ${quantity} item(s) to cart!`);
    };

    // ✅ Handle add to wishlist
    const handleAddToWishlist = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        console.log('Added to wishlist:', product._id);
        dispatch(addToWishlist(product._id));
        alert('Added to wishlist!');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Error Message */}
            {error && (
                <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700">❌ {error}</p>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <button onClick={() => navigate('/')} className="hover:text-teal-600">
                        Home
                    </button>
                    <span className="mx-2">›</span>
                    <button onClick={() => navigate('/products')} className="hover:text-teal-600">
                        Products
                    </button>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900 font-medium">{product?.name}</span>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Images */}
                        <div>
                            {/* Main Image */}
                            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={mainImage?.secure_url}
                                    alt={mainImage?.alt}
                                    className="w-full h-96 object-cover"
                                />
                            </div>

                            {/* Thumbnail Images */}
                            <div className="grid grid-cols-4 gap-2">
                                {product?.images.map((image, index) => (
                                    <button
                                        key={image._id}
                                        onClick={() => setMainImage(image)}
                                        className={`relative overflow-hidden rounded-lg border-2 transition ${
                                            mainImage?._id === image._id
                                                ? 'border-teal-600'
                                                : 'border-gray-200 hover:border-teal-400'
                                        }`}
                                    >
                                        <img
                                            src={image.secure_url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Stock Status */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-600">Stock Available</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {product?.stock.available > 0 ? product?.stock.available : 0}
                                </p>
                                {product?.stock.available <= product?.stock.reorderLevel && (
                                    <p className="text-sm text-orange-600 mt-2">⚠️ Limited stock</p>
                                )}
                            </div>
                        </div>

                        {/* Right: Product Info */}
                        <div>
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>

                            {/* SKU & Rating */}
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-600">SKU: {product?.sku}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400">★</span>
                                    <span className="font-semibold">
                                        {product?.ratings.average.toFixed(1)} ({product?.ratings.totalReviews} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 mb-6 leading-relaxed">{product?.description}</p>

                            {/* Pricing */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase">Regular Price</p>
                                        <p className="text-lg line-through text-gray-500">
                                            ₹{product?.pricing.regularPrice.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase">Selling Price</p>
                                        <p className="text-2xl font-bold text-teal-600">
                                            ₹{product?.pricing.sellingPrice.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Discount Badge */}
                                {discountPercent > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Save {discountPercent}% 🎉
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Specifications */}
                            {product?.specifications && product?.specifications.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                                    <div className="space-y-2">
                                        {product?.specifications.map((spec) => (
                                            <div key={spec._id} className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600 capitalize">{spec.key}</span>
                                                <span className="font-medium text-gray-900 capitalize">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Warranty */}
                            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="font-semibold text-gray-900 mb-1">✅ Warranty</p>
                                <p className="text-sm text-gray-700">
                                    {product?.warranty.period} {product?.warranty.unit} warranty
                                </p>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex gap-4 mb-6">
                                {/* Quantity */}
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                           {/* ✅ FIXED: Buy Now Button instead of Add to Cart */}
                            <button
                                onClick={handleBuyNow}
                                disabled={product?.stock?.available === 0}
                                className="w-full mb-3 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                            >
                                💳 Buy Now
                            </button>

                            {/* Wishlist Button */}
                            <button
                                onClick={handleAddToWishlist}
                                className="w-full px-6 py-3 bg-pink-50 text-pink-600 font-semibold rounded-lg hover:bg-pink-100 border border-pink-200 transition"
                            >
                                ♡ Add to Wishlist
                            </button>

                            {/* Return Policy */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-gray-700">
                                <p className="font-semibold mb-1">📦 Return Policy</p>
                                <p>
                                    {product?.returnPolicy.returnable
                                        ? `Returnable within ${product.returnPolicy.returnDays} days`
                                        : 'Non-returnable'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Tab Buttons */}
                    <div className="flex gap-4 border-b border-gray-200 mb-6">
                        {['overview', 'reviews', 'shipping'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 font-semibold capitalize transition ${
                                    activeTab === tab
                                        ? 'text-teal-600 border-b-2 border-teal-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Sold</p>
                                    <p className="text-2xl font-bold text-gray-900">{product?.metrics.totalSold}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Views</p>
                                    <p className="text-2xl font-bold text-gray-900">{product?.metrics.views}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Wishlist Count</p>
                                    <p className="text-2xl font-bold text-gray-900">{product?.metrics.wishlistCount}</p>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">About This Product</h4>
                                <p className="text-gray-700">{product?.description}</p>
                                {product?.tags && product?.tags.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Tags:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {product?.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                            {product?.ratings.totalReviews === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">No reviews yet</p>
                                    <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                                        Be the first to review
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-4xl font-bold text-gray-900">
                                                {product?.ratings.average.toFixed(1)}
                                            </p>
                                            <p className="text-yellow-400">★★★★★</p>
                                            <p className="text-sm text-gray-600">{product?.ratings.totalReviews} reviews</p>
                                        </div>
                                        {/* Rating Distribution */}
                                        <div className="flex-1 space-y-2">
                                            {['five', 'four', 'three', 'two', 'one'].map((star) => (
                                                <div key={star} className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600 w-12">{star}</span>
                                                    <div className="h-2 bg-gray-200 flex-1 rounded-full">
                                                        <div
                                                            className="h-2 bg-yellow-400 rounded-full"
                                                            style={{
                                                                width: `${(product?.ratings.distribution[star] / product.ratings.totalReviews) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-900 mb-2">📦 Shipping</p>
                                    <p className="text-gray-700">Free shipping on orders over ₹500</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-900 mb-2">🔄 Returns</p>
                                    <p className="text-gray-700">
                                        {product.returnPolicy.returnable
                                            ? `Easy returns within ${product.returnPolicy.returnDays} days`
                                            : 'Non-returnable product'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-semibold text-gray-900 mb-2">✅ Warranty</p>
                                    <p className="text-gray-700">
                                        {product.warranty.period} {product.warranty.unit} manufacturer warranty included
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <p className="text-gray-600">Related products feature coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
