// src/pages/user/Cart.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Cart = () => {
    // Mock cart data - replace with Redux if you have cart slice
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Premium Headphones',
            price: 299.99,
            quantity: 1,
            image: '🎧',
            discount: 10,
        },
        {
            id: 2,
            name: 'Wireless Mouse',
            price: 49.99,
            quantity: 2,
            image: '🖱️',
            discount: 0,
        },
        {
            id: 3,
            name: 'USB-C Cable',
            price: 19.99,
            quantity: 1,
            image: '🔌',
            discount: 5,
        },
    ]);

    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const itemDiscount = cartItems.reduce(
        (sum, item) => sum + (item.price * item.quantity * item.discount) / 100,
        0
    );

    const shipping = cartItems.length > 0 ? 9.99 : 0;
    const tax = (subtotal - itemDiscount) * 0.1;
    const total = subtotal - itemDiscount - couponDiscount + shipping + tax;

    // Handle quantity change
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity === 0) {
            removeItem(id);
        } else {
            setCartItems(
                cartItems.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    // Remove item
    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    // Apply coupon
    const applyCoupon = () => {
        if (appliedCoupon === 'SAVE10') {
            setCouponDiscount(subtotal * 0.1);
            alert('✅ Coupon applied! 10% off');
        } else if (appliedCoupon === 'SAVE20') {
            setCouponDiscount(subtotal * 0.2);
            alert('✅ Coupon applied! 20% off');
        } else {
            alert('❌ Invalid coupon code');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">🛒 Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">
                        {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                {/* Empty Cart */}
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">
                            Start shopping to add items to your cart!
                        </p>
                        <Link
                            to="/products"
                            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                                    >
                                        {/* Product Image */}
                                        <div className="text-5xl">{item.image}</div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-lg font-bold text-teal-600">
                                                    ${(item.price - (item.price * item.discount) / 100).toFixed(2)}
                                                </span>
                                                {item.discount > 0 && (
                                                    <>
                                                        <span className="text-sm line-through text-gray-500">
                                                            ${item.price.toFixed(2)}
                                                        </span>
                                                        <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                                                            -{item.discount}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-100 transition"
                                            >
                                                −
                                            </button>
                                            <span className="px-4 py-1 font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-100 transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right min-w-24">
                                            <p className="font-bold text-gray-900">
                                                ${(item.price * item.quantity - (item.price * item.quantity * item.discount) / 100).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Delete */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-4">
                                <Link
                                    to="/products"
                                    className="text-teal-600 hover:text-teal-700 font-semibold transition"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    📋 Order Summary
                                </h2>

                                {/* Subtotal */}
                                <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>

                                {/* Item Discount */}
                                {itemDiscount > 0 && (
                                    <div className="flex justify-between mb-4 pb-4 border-b border-gray-200 text-green-600">
                                        <span>Discount</span>
                                        <span>-${itemDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                {/* Coupon */}
                                <div className="mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={appliedCoupon}
                                            onChange={(e) => setAppliedCoupon(e.target.value)}
                                            placeholder="Coupon code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition text-sm"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Try: SAVE10 or SAVE20
                                    </p>
                                </div>

                                {/* Coupon Discount */}
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between mb-4 pb-4 border-b border-gray-200 text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-${couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                {/* Shipping */}
                                <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                                    <span className="text-gray-700">Shipping</span>
                                    <span className="font-semibold">${shipping.toFixed(2)}</span>
                                </div>

                                {/* Tax */}
                                <div className="flex justify-between mb-6 pb-4 border-b border-gray-200">
                                    <span className="text-gray-700">Tax (10%)</span>
                                    <span className="font-semibold">${tax.toFixed(2)}</span>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between mb-6 bg-teal-50 p-4 rounded-lg">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg text-teal-600">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    to="/checkout"
                                    className="block w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 font-semibold text-center transition"
                                >
                                    💳 Proceed to Checkout
                                </Link>

                                {/* Continue Shopping */}
                                <Link
                                    to="/products"
                                    className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-center transition mt-3"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Safe Checkout Badge */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                                    <p className="text-xs text-gray-600">🔒 Safe & Secure Checkout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Free Shipping Banner */}
                {cartItems.length > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 text-center">
                        <p className="text-green-700 font-semibold">
                            ✅ Free shipping on orders over $100! Add ${Math.max(0, (100 - subtotal).toFixed(2))} more to qualify.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
