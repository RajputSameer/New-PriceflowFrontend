import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword, getProfile } from '../../REDUX/SLICES/authSlice';
import { clearError, clearMessage } from '../../REDUX/SLICES/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    console.log('🔵 Profile component mounted');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('profile');
    const [hasInitialized, setHasInitialized] = useState(false);
    
    // ✅ Check if user is a seller
    const isSeller = user?.role === 'SELLER';
    const isAdmin = user?.role === 'ADMIN';

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    // ✅ NEW: Seller-specific fields
    const [sellerData, setSellerData] = useState({
        storeName: '',
        storeDescription: '',
        gst: '',
        panNumber: '',
        bankAccountName: '',
        bankAccountNumber: '',
        ifscCode: '',
        bankName: '',
        businessType: 'retail', // retail, wholesale, both
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    // ✅ STEP 1: FETCH PROFILE DATA ON MOUNT (ONLY ONCE)
    useEffect(() => {
        console.log('🟡 useEffect: Checking if we need to fetch profile...');
        console.log('   - isAuthenticated:', isAuthenticated);
        console.log('   - hasInitialized:', hasInitialized);
        console.log('   - user exists:', !!user);

        // Only fetch if authenticated and haven't initialized yet
        if (isAuthenticated && !hasInitialized) {
            console.log('🟢 Fetching profile from backend...');
            setHasInitialized(true);
            
            dispatch(getProfile())
                .unwrap()
                .then((data) => {
                    console.log('✅ Profile fetched successfully:', data);
                })
                .catch((err) => {
                    console.error('❌ Profile fetch failed:', err);
                });
        }
    }, [isAuthenticated, hasInitialized, dispatch]);

    // ✅ STEP 2: UPDATE FORM WHEN USER DATA CHANGES
    useEffect(() => {
        console.log('🟡 useEffect: User data changed, updating form...');
        if (user) {
            console.log('👤 Setting form data from user:', user);
            setProfileData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                address: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zipCode: user.address?.zipCode || '',
            });

            // ✅ NEW: Set seller data if seller
            if (isSeller && user.sellerProfile) {
                setSellerData({
                    storeName: user.sellerProfile?.storeName || '',
                    storeDescription: user.sellerProfile?.storeDescription || '',
                    gst: user.sellerProfile?.gst || '',
                    panNumber: user.sellerProfile?.panNumber || '',
                    bankAccountName: user.sellerProfile?.bankDetails?.accountName || '',
                    bankAccountNumber: user.sellerProfile?.bankDetails?.accountNumber || '',
                    ifscCode: user.sellerProfile?.bankDetails?.ifscCode || '',
                    bankName: user.sellerProfile?.bankDetails?.bankName || '',
                    businessType: user.sellerProfile?.businessType || 'retail',
                });
            }
        }
    }, [user, isSeller]);

    // ✅ STEP 3: CLEAR MESSAGES AFTER 5 SECONDS
    useEffect(() => {
        if (error || message) {
            console.log('⏱️ Message/Error detected, clearing in 5 seconds...');
            const timer = setTimeout(() => {
                if (error) dispatch(clearError());
                if (message) dispatch(clearMessage());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, message, dispatch]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ NEW: Handle seller data change
    const handleSellerChange = (e) => {
        const { name, value } = e.target;
        setSellerData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        console.log('💾 Submitting profile update...');

        const updatedData = {
            fullName: profileData.fullName,
            email: profileData.email,
            phone: profileData.phone,
            bio: profileData.bio,
            address: {
                street: profileData.address,
                city: profileData.city,
                state: profileData.state,
                zipCode: profileData.zipCode,
            },
        };

        try {
            await dispatch(updateProfile(updatedData)).unwrap();
            console.log('✅ Profile updated successfully');
            dispatch(getProfile());
        } catch (err) {
            console.error('❌ Profile update failed:', err);
        }
    };

    // ✅ NEW: Handle seller profile update
    const handleSellerSubmit = async (e) => {
        e.preventDefault();
        console.log('💾 Submitting seller profile update...');

        // Validate seller data
        if (!sellerData.storeName.trim()) {
            alert('Store name is required');
            return;
        }

        if (!sellerData.gst.trim()) {
            alert('GST number is required');
            return;
        }

        if (!sellerData.panNumber.trim()) {
            alert('PAN number is required');
            return;
        }

        if (!sellerData.bankAccountNumber.trim()) {
            alert('Bank account number is required');
            return;
        }

        const updatedData = {
            sellerProfile: {
                storeName: sellerData.storeName,
                storeDescription: sellerData.storeDescription,
                gst: sellerData.gst,
                panNumber: sellerData.panNumber,
                businessType: sellerData.businessType,
                bankDetails: {
                    accountName: sellerData.bankAccountName,
                    accountNumber: sellerData.bankAccountNumber,
                    ifscCode: sellerData.ifscCode,
                    bankName: sellerData.bankName,
                }
            }
        };

        try {
            await dispatch(updateProfile(updatedData)).unwrap();
            console.log('✅ Seller profile updated successfully');
            dispatch(getProfile());
        } catch (err) {
            console.error('❌ Seller profile update failed:', err);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }

        console.log('🔐 Changing password...');

        try {
            await dispatch(
                changePassword({
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                })
            ).unwrap();

            console.log('✅ Password changed successfully');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            console.error('❌ Password change failed:', err);
        }
    };

    // ✅ Handle seller dashboard navigation
    const handleGoToSellerDashboard = () => {
        navigate('/seller/dashboard');
    };

    // ✅ SHOW LOADING STATE ONLY ON INITIAL LOAD
    if (!hasInitialized && loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // ✅ SHOW NOT AUTHENTICATED MESSAGE
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-lg font-semibold text-gray-900 mb-2">❌ Not Authenticated</p>
                    <p className="text-gray-600">Please log in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isSeller ? '🏪 Seller Account' : '👤 My Account'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isSeller 
                                    ? 'Manage your seller profile and store' 
                                    : 'Manage your profile and preferences'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {isSeller && (
                                <button
                                    onClick={handleGoToSellerDashboard}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition"
                                >
                                    📊 Go to Dashboard
                                </button>
                            )}
                            <div className="text-4xl">
                                {isSeller ? '🏪' : '👤'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {message && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded animate-in">
                        <p className="text-green-700 font-medium">✅ {message}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded animate-in">
                        <p className="text-red-700 font-medium">❌ {error}</p>
                    </div>
                )}

                {/* User Info Card */}
                {user && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-gray-600 text-sm">Name</p>
                                <p className="text-lg font-semibold text-gray-900">{user.fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Email</p>
                                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Role</p>
                                <p className={`text-lg font-semibold capitalize ${
                                    isSeller ? 'text-orange-600' : 'text-teal-600'
                                }`}>
                                    {user.role?.toLowerCase()}
                                </p>
                            </div>
                        </div>

                        {/* ✅ NEW: Seller-specific info */}
                        {isSeller && user.sellerProfile && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                                <div>
                                    <p className="text-gray-600 text-sm">Store Name</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {user.sellerProfile.storeName || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Business Type</p>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">
                                        {user.sellerProfile.businessType || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">GST Number</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {user.sellerProfile.gst || 'Not set'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Seller Status</p>
                                    <p className={`text-lg font-semibold ${
                                        user.sellerProfile?.isVerified 
                                            ? 'text-green-600' 
                                            : 'text-yellow-600'
                                    }`}>
                                        {user.sellerProfile?.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-3 px-6 font-semibold text-center transition whitespace-nowrap ${
                                activeTab === 'profile'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            👤 Profile
                        </button>

                        {/* ✅ NEW: Seller tab */}
                        {isSeller && (
                            <button
                                onClick={() => setActiveTab('seller')}
                                className={`flex-1 py-3 px-6 font-semibold text-center transition whitespace-nowrap ${
                                    activeTab === 'seller'
                                        ? 'border-b-2 border-orange-600 text-orange-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                🏪 Store Profile
                            </button>
                        )}

                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 py-3 px-6 font-semibold text-center transition whitespace-nowrap ${
                                activeTab === 'password'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            🔐 Password
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 py-3 px-6 font-semibold text-center transition whitespace-nowrap ${
                                activeTab === 'settings'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            ⚙️ Settings
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Cannot change email</p>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <input
                                            type="text"
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            placeholder="Tell us about yourself"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            placeholder="123 Main St"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profileData.city}
                                            onChange={handleProfileChange}
                                            placeholder="Noida"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            State / Province
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={profileData.state}
                                            onChange={handleProfileChange}
                                            placeholder="UP"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Zip Code */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Zip Code
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={profileData.zipCode}
                                            onChange={handleProfileChange}
                                            placeholder="201001"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-teal-600 hover:bg-teal-700'
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Saving...
                                        </span>
                                    ) : (
                                        '💾 Save Changes'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* ✅ NEW: Seller Tab */}
                        {activeTab === 'seller' && isSeller && (
                            <form onSubmit={handleSellerSubmit} className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">🏪 Store Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Store Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Store Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="storeName"
                                            value={sellerData.storeName}
                                            onChange={handleSellerChange}
                                            placeholder="My Amazing Store"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Store Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Store Description
                                        </label>
                                        <textarea
                                            name="storeDescription"
                                            value={sellerData.storeDescription}
                                            onChange={handleSellerChange}
                                            placeholder="Tell customers about your store..."
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Business Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Business Type
                                        </label>
                                        <select
                                            name="businessType"
                                            value={sellerData.businessType}
                                            onChange={handleSellerChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={loading}
                                        >
                                            <option value="retail">Retail</option>
                                            <option value="wholesale">Wholesale</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>

                                    {/* GST */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            GST Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="gst"
                                            value={sellerData.gst}
                                            onChange={handleSellerChange}
                                            placeholder="07XXXXX0000X1Z5"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* PAN */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            PAN Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={sellerData.panNumber}
                                            onChange={handleSellerChange}
                                            placeholder="AAAAA0000A"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">💳 Bank Details</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Bank Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={sellerData.bankName}
                                                onChange={handleSellerChange}
                                                placeholder="HDFC Bank"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Account Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Account Holder Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="bankAccountName"
                                                value={sellerData.bankAccountName}
                                                onChange={handleSellerChange}
                                                placeholder="Your Name"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Account Number */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Account Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="bankAccountNumber"
                                                value={sellerData.bankAccountNumber}
                                                onChange={handleSellerChange}
                                                placeholder="1234567890"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* IFSC Code */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                IFSC Code
                                            </label>
                                            <input
                                                type="text"
                                                name="ifscCode"
                                                value={sellerData.ifscCode}
                                                onChange={handleSellerChange}
                                                placeholder="HDFC0000123"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-orange-600 hover:bg-orange-700'
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Saving...
                                        </span>
                                    ) : (
                                        '💾 Save Store Profile'
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto space-y-6">
                                {/* Old Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.old ? 'text' : 'password'}
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords((prev) => ({
                                                    ...prev,
                                                    old: !prev.old,
                                                }))
                                            }
                                            className="absolute right-3 top-2.5 text-gray-400"
                                        >
                                            {showPasswords.old ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords((prev) => ({
                                                    ...prev,
                                                    new: !prev.new,
                                                }))
                                            }
                                            className="absolute right-3 top-2.5 text-gray-400"
                                        >
                                            {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        At least 8 characters with uppercase and numbers
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswords((prev) => ({
                                                    ...prev,
                                                    confirm: !prev.confirm,
                                                }))
                                            }
                                            className="absolute right-3 top-2.5 text-gray-400"
                                        >
                                            {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-teal-600 hover:bg-teal-700'
                                    }`}
                                >
                                    {loading ? 'Updating...' : '🔐 Update Password'}
                                </button>
                            </form>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                {/* Notification Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        📧 Notification Preferences
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                defaultChecked={user?.preferences?.emailNotifications?.orders}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">
                                                {isSeller ? 'Email notifications for new orders' : 'Email notifications for orders'}
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                defaultChecked={user?.preferences?.emailNotifications?.promotions}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">
                                                {isSeller ? 'Promotional opportunities' : 'Product recommendations'}
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                defaultChecked={user?.preferences?.emailNotifications?.news}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">
                                                {isSeller ? 'Seller news and updates' : 'Promotional offers'}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Privacy Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        🔒 Privacy
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                defaultChecked={user?.isProfilePublic}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">
                                                {isSeller ? 'Show store to other users' : 'Show profile to other users'}
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700">
                                                Allow data collection
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Account Stats */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        📊 Account Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600 text-sm">Login Count</p>
                                            <p className="text-2xl font-bold text-teal-600">
                                                {user?.loginCount || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm">Account Status</p>
                                            <p className="text-lg font-bold text-green-600">
                                                {user?.isActive ? '✅ Active' : '❌ Inactive'}
                                            </p>
                                        </div>

                                        {/* ✅ NEW: Seller stats */}
                                        {isSeller && (
                                            <>
                                                <div>
                                                    <p className="text-gray-600 text-sm">Total Products</p>
                                                    <p className="text-2xl font-bold text-orange-600">
                                                        {user?.sellerProfile?.totalProducts || 0}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 text-sm">Total Orders</p>
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {user?.sellerProfile?.totalOrders || 0}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 text-sm">Seller Rating</p>
                                                    <p className="text-2xl font-bold text-yellow-600">
                                                        {user?.sellerProfile?.rating?.toFixed(1) || 'N/A'} ⭐
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 text-sm">Total Revenue</p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        ₹{user?.sellerProfile?.totalRevenue || 0}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-red-600 mb-4">
                                        ⚠️ Danger Zone
                                    </h3>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition"
                                    >
                                        🗑️ Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
