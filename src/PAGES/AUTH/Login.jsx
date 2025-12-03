// src/pages/auth/Login.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../REDUX/SLICES/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    // ✅ Auto-redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user?.role === 'seller') {
                navigate('/seller/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate]);

    // ✅ Clear error when user starts typing
    useEffect(() => {
        if (localError) setLocalError('');
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            setLocalError('Email is required');
            return false;
        }
        if (!formData.email.includes('@')) {
            setLocalError('Please enter a valid email');
            return false;
        }
        if (!formData.password) {
            setLocalError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!validateForm()) return;

        try {
            await dispatch(loginUser(formData)).unwrap();
            // Redux will handle redirect via useEffect
        } catch (err) {
            console.error('Login failed:', err);
            setLocalError(err || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="text-4xl font-bold text-white">₹</div>
                            <h1 className="text-3xl font-bold text-white">PriceFlow</h1>
                        </div>
                        <p className="text-teal-100 text-sm">Smart Pricing Platform</p>
                    </div>

                    {/* Form Container */}
                    <div className="px-6 py-8">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 text-sm mb-6">Sign in to your account</p>

                        {/* Error Message */}
                        {(error || localError) && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                                <p className="text-red-700 text-sm font-medium">
                                    {error || localError}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                        disabled={loading}
                                    />
                                    <span className="absolute right-3 top-3.5 text-gray-400">
                                        ✉️
                                    </span>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
                                        disabled={loading}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                        disabled={loading}
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 mt-6 ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-lg hover:scale-105 active:scale-95'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login (Placeholder) */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                disabled={loading}
                                className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span>👤</span>
                                <span className="text-sm font-medium">Google</span>
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span>📘</span>
                                <span className="text-sm font-medium">GitHub</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-teal-600 hover:text-teal-700 transition"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="mt-6 text-center text-gray-600 text-xs">
                    <p>By signing in, you agree to our</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <a href="#" className="text-teal-600 hover:underline">
                            Terms of Service
                        </a>
                        <span>•</span>
                        <a href="#" className="text-teal-600 hover:underline">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
