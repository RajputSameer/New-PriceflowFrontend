// src/pages/auth/Register.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../REDUX/SLICES/authSlice';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

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
        if (!formData.fullName.trim()) {
            setLocalError('Full name is required');
            return false;
        }
        if (formData.fullName.trim().length < 2) {
            setLocalError('Full name must be at least 2 characters');
            return false;
        }
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
        if (formData.password.length < 8) {
            setLocalError('Password must be at least 8 characters');
            return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setLocalError('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[0-9]/.test(formData.password)) {
            setLocalError('Password must contain at least one number');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return false;
        }
        if (!termsAccepted) {
            setLocalError('You must accept the Terms of Service');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!validateForm()) return;

        try {
            await dispatch(
                registerUser({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                })
            ).unwrap();
            // Redux will handle redirect via useEffect
        } catch (err) {
            console.error('Registration failed:', err);
            setLocalError(err || 'Registration failed. Please try again.');
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
                        <p className="text-teal-100 text-sm">Join Our Pricing Platform</p>
                    </div>

                    {/* Form Container */}
                    <div className="px-6 py-8">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-600 text-sm mb-6">Get started in just a few minutes</p>

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
                            {/* Full Name Field */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                        disabled={loading}
                                    />
                                    <span className="absolute right-3 top-3.5 text-gray-400">
                                        👤
                                    </span>
                                </div>
                            </div>

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

                            {/* Role Selection */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Register As
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                >
                                    <option value="USER">Buyer</option>
                                    <option value="SELLER">Seller</option>
                                </select>
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
                                <p className="text-xs text-gray-500 mt-2">
                                    • At least 8 characters
                                    <br />
                                    • 1 uppercase letter & 1 number
                                </p>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                        disabled={loading}
                                    />
                                    <span className="text-sm text-gray-600">
                                        I agree to the{' '}
                                        <a href="#" className="text-teal-600 hover:underline">
                                            Terms of Service
                                        </a>
                                        {' '}and{' '}
                                        <a href="#" className="text-teal-600 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
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
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-teal-600 hover:text-teal-700 transition"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
