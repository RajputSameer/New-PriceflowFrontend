// src/layouts/MobileNav.jsx

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/home') {
            setActiveTab('home');
        } else if (location.pathname.includes('/search')) {
            setActiveTab('search');
        } else if (location.pathname.includes('/wishlist')) {
            setActiveTab('wishlist');
        } else if (location.pathname.includes('/orders')) {
            setActiveTab('orders');
        } else if (location.pathname.includes('/profile') || location.pathname.includes('/settings')) {
            setActiveTab('account');
        }
    }, [location]);

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠', path: '/' },
        { id: 'search', label: 'Search', icon: '🔍', path: '/search' },
        { id: 'wishlist', label: 'Wishlist', icon: '❤️', path: '/wishlist' },
        { id: 'orders', label: 'Orders', icon: '📦', path: '/orders' },
        { id: 'account', label: 'Account', icon: '👤', path: '/profile' },
    ];

    return (
        <div className="flex justify-around items-center h-16 bg-white border-t border-gray-200">
            {navItems.map((item) => (
                <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center flex-1 h-full gap-1 ${
                        activeTab === item.id
                            ? 'text-teal-600 border-t-2 border-teal-600'
                            : 'text-gray-600'
                    }`}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default MobileNav;
