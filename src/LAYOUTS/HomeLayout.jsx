import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';  // ← ADD THIS
import { useSelector, useDispatch } from 'react-redux';
import DesktopNav from './DesktopNav.jsx';
import MobileNav from './MobileNav';
import { restoreAuth } from '../REDUX/SLICES/authSlice';

const HomeLayout = () => {  // ← Remove children parameter
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(restoreAuth());
    }, [dispatch]);

    return (
        <div className="flex flex-col min-h-screen bg-yellow-50">
            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <nav className="hidden lg:block sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <DesktopNav />
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 w-full pb-20 lg:pb-0">
                <Outlet />  {/* ← CHANGE THIS from {children} */}
            </main>

            {/* Mobile Navigation - Hidden on desktop */}
            <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-white border-t border-gray-200 shadow-lg">
                <MobileNav />
            </nav>

            {/* Footer */}
           {/* Footer */}
<footer className="hidden md:block bg-gray-900 text-white py-12 px-4 md:px-8">
    <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
                <h3 className="text-xl font-bold mb-4">PriceFlow</h3>
                <p className="text-gray-400 text-sm">Smart pricing for smarter businesses</p>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white">Home</a></li>
                    <li><a href="#" className="hover:text-white">Categories</a></li>
                    <li><a href="#" className="hover:text-white">Sellers</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white">Privacy</a></li>
                    <li><a href="#" className="hover:text-white">Terms</a></li>
                    <li><a href="#" className="hover:text-white">Cookies</a></li>
                </ul>
            </div>
        </div>

        {/* ✅ NEW: Team Members Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
            <h4 className="font-semibold mb-6 text-center text-lg">
                Built with <span className="heart-beat text-red-500 mx-1">❤️</span>
 by Team
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                    <p className="text-sm font-semibold text-white">Sameer</p>
                    <p className="text-xs text-gray-400 mt-1">2204921540140</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                    <p className="text-sm font-semibold text-white">Ravinder</p>
                    <p className="text-xs text-gray-400 mt-1">2204921540128</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                    <p className="text-sm font-semibold text-white">Aditya Yadav</p>
                    <p className="text-xs text-gray-400 mt-1">2204921540013</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                    <p className="text-sm font-semibold text-white">Lakshay Solanki</p>
                    <p className="text-xs text-gray-400 mt-1">2204921540087</p>
                </div>
            </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 PriceFlow. All rights reserved.</p>
        </div>
    </div>
</footer>

        </div>
    );
};

export default HomeLayout;
