// src/layouts/DesktopNav.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../REDUX/SLICES/authSlice';
import { toggleDarkMode } from '../REDUX/SLICES/uiSlice';

const DesktopNav = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-teal-600">₹</div>
                        <span className="text-xl font-bold text-gray-900">PriceFlow</span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                🔍
                            </button>
                        </div>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Cart */}
                        <Link to="/cart" className="relative text-gray-700 hover:text-teal-600 transition">
                            🛒
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 apx-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    👤
                                    <span className="text-sm  ">{user?.fullName}</span>
                                    
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                                        <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Wishlist</Link>
                                        <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Orders</Link>
                                        
                                        {user?.role === 'seller' && (
                                            <>
                                                <hr />
                                                <Link to="/seller/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Seller Dashboard</Link>
                                            </>
                                        )}
                                        
                                        {user?.role === 'admin' && (
                                            <>
                                                <hr />
                                                <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admin Panel</Link>
                                            </>
                                        )}
                                        
                                        <hr />
                                        <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-teal-600">Login</Link>
                                <Link to="/register" className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopNav;
