// ✅ COMPLETE: src/PAGES/SELLER/CreateProduct.jsx
// Product creation page with image upload via Multer

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct, clearError, clearMessage, uploadProductImages } from '../../REDUX/SLICES/productSlice';
import { getCategories } from '../../REDUX/SLICES/categorySlice';

const CreateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message } = useSelector((state) => state.product);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        category: '',
        costPrice: '',
        regularPrice: '',
        sellingPrice: '',
        discountPercentage: 0,
        availableStock: '',
        reorderLevel: 10,
        tags: '',
        businessType: 'retail',
        warrantyPeriod: 0,
        warrantyUnit: 'days',
        warrantyDescription: '',
        returnable: true,
        returnDays: 30,
    });

    const [specifications, setSpecifications] = useState([
        { key: '', value: '' }
    ]);

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
   const { categories, loading: catLoading } = useSelector(
    (state) => state.category
);
    const [activeStep, setActiveStep] = useState(1);

    // ✅ Fetch categories on mount
    useEffect(() => {
    dispatch(getCategories());
}, [dispatch]);


    // ✅ Clear messages after 5 seconds
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                if (error) dispatch(clearError());
                if (message) dispatch(clearMessage());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, message, dispatch]);

    // ✅ Check authentication
    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'SELLER') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    // ✅ Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // ✅ Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Validate number of images
        if (files.length + images.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        // Add files to images state
        setImages((prev) => [...prev, ...files]);

        // Create previews
        const newPreviews = files.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    // ✅ Remove image
    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    // ✅ Handle specification change
    const handleSpecificationChange = (index, field, value) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };

    // ✅ Add specification field
    const handleAddSpecification = () => {
        setSpecifications((prev) => [...prev, { key: '', value: '' }]);
    };

    // ✅ Remove specification field
    const handleRemoveSpecification = (index) => {
        setSpecifications((prev) => prev.filter((_, i) => i !== index));
    };

   // ✅ UPDATED: Two-step product creation
const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
        alert('Product name is required');
        return;
    }

    if (!formData.sku.trim()) {
        alert('SKU is required');
        return;
    }

    if (!formData.description.trim() || formData.description.length < 10) {
        alert('Description is required and must be at least 10 characters');
        return;
    }

    if (!formData.category) {
        alert('Category is required');
        return;
    }

    if (!formData.costPrice || !formData.regularPrice || !formData.sellingPrice) {
        alert('All pricing details are required');
        return;
    }

    if (parseFloat(formData.sellingPrice) > parseFloat(formData.regularPrice)) {
        alert('Selling price cannot be greater than regular price');
        return;
    }

    if (images.length === 0) {
        alert('At least one image is required');
        return;
    }

    // ✅ STEP 1: Create product WITHOUT images
    const productFormData = new FormData();
    productFormData.append('name', formData.name);
    productFormData.append('sku', formData.sku);
    productFormData.append('description', formData.description);
    productFormData.append('category', formData.category);

    // Append pricing
    productFormData.append('pricing', JSON.stringify({
        costPrice: parseFloat(formData.costPrice),
        regularPrice: parseFloat(formData.regularPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
    }));

    // Append stock
    productFormData.append('stock', JSON.stringify({
        available: parseInt(formData.availableStock) || 0,
        reorderLevel: parseInt(formData.reorderLevel) || 10,
    }));

    // Append tags
    const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    productFormData.append('tags', JSON.stringify(tagsArray));

    // Append specifications
    const specsArray = specifications.filter(
        (spec) => spec.key.trim() && spec.value.trim()
    );
    productFormData.append('specifications', JSON.stringify(specsArray));

    // Append warranty
    productFormData.append('warranty', JSON.stringify({
        period: parseInt(formData.warrantyPeriod) || 0,
        unit: formData.warrantyUnit,
        description: formData.warrantyDescription,
    }));

    // Append return policy
    productFormData.append('returnPolicy', JSON.stringify({
        returnable: formData.returnable,
        returnDays: parseInt(formData.returnDays) || 30,
    }));

    // ❌ DO NOT APPEND IMAGES HERE!

    try {
        // ✅ STEP 1: Create product
        console.log('📝 Step 1: Creating product...');
        const createdProduct = await dispatch(createProduct(productFormData)).unwrap();
        console.log('✅ Product created:', createdProduct.product._id);

        // ✅ STEP 2: Upload images to created product
        console.log('📸 Step 2: Uploading images...');
        const imageFormData = new FormData();
        images.forEach((image) => {
            imageFormData.append('images', image);
        });

        await dispatch(uploadProductImages({
            productId: createdProduct.product._id,
            formData: imageFormData
        })).unwrap();

        console.log('✅ Images uploaded successfully');
        alert('Product created successfully with images!');
        navigate('/seller/products');

    } catch (err) {
        console.error('❌ Failed:', err);
        // Product was created, but images failed
        // User should use upload endpoint to add images later
    }
};

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">📦 Create Product</h1>
                            <p className="text-gray-600 mt-1">Add a new product to your store</p>
                        </div>
                        <div className="text-4xl">📦</div>
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

                {/* Step Indicator */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                                        activeStep >= step
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 ${
                                            activeStep > step ? 'bg-teal-600' : 'bg-gray-200'
                                        }`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-gray-600">
                        <span>Basic Info</span>
                        <span>Pricing</span>
                        <span>Images</span>
                        <span>Details</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Step 1: Basic Information */}
                    {activeStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter product name"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                {/* SKU */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        SKU *
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        placeholder="e.g., SKU001"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                   <select
    name="category"
    value={formData.category}
    onChange={handleInputChange}
    required
    disabled={catLoading}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
>
    <option value="">
        {catLoading ? 'Loading categories...' : 'Select Category'}
    </option>
    {categories && categories.length > 0 ? (
        categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
                {cat.name}
            </option>
        ))
    ) : (
        <option disabled>No categories available</option>
    )}
</select>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter detailed product description (minimum 10 characters)"
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    ></textarea>
                                </div>

                                {/* Tags */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="e.g., electronics, gadget, phone"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    disabled={true}
                                    className="px-6 py-2 text-gray-500 cursor-not-allowed"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(2)}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Pricing */}
                    {activeStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">💰 Pricing</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Cost Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cost Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="costPrice"
                                        value={formData.costPrice}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                {/* Regular Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Regular Price (MRP) *
                                    </label>
                                    <input
                                        type="number"
                                        name="regularPrice"
                                        value={formData.regularPrice}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                {/* Selling Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Selling Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        value={formData.sellingPrice}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                {/* Discount Percentage */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Discount % (auto-calculated)
                                    </label>
                                    <input
                                        type="number"
                                        name="discountPercentage"
                                        value={formData.discountPercentage}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                        disabled
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Available Stock
                                    </label>
                                    <input
                                        type="number"
                                        name="availableStock"
                                        value={formData.availableStock}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                {/* Reorder Level */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Reorder Level
                                    </label>
                                    <input
                                        type="number"
                                        name="reorderLevel"
                                        value={formData.reorderLevel}
                                        onChange={handleInputChange}
                                        placeholder="10"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(1)}
                                    className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-semibold"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(3)}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Images */}
                    {activeStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🖼️ Product Images</h2>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Upload Images (Max 5) *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <p className="text-gray-600 text-lg">📤 Click to upload or drag images</p>
                                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                                        <p className="text-gray-400 text-sm">Maximum 5 images</p>
                                    </label>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Images ({imagePreviews.length}/5)</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                                                >
                                                    ×
                                                </button>
                                                <p className="text-xs text-gray-600 mt-1 truncate">{preview.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(2)}
                                    className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-semibold"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(4)}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Additional Details */}
                    {activeStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">📋 Additional Details</h2>

                            {/* Specifications */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                                <div className="space-y-3">
                                    {specifications.map((spec, index) => (
                                        <div key={index} className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="Key (e.g., Color)"
                                                value={spec.key}
                                                onChange={(e) =>
                                                    handleSpecificationChange(index, 'key', e.target.value)
                                                }
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value (e.g., Red)"
                                                value={spec.value}
                                                onChange={(e) =>
                                                    handleSpecificationChange(index, 'value', e.target.value)
                                                }
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            {specifications.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSpecification(index)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSpecification}
                                    className="mt-3 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                                >
                                    + Add Specification
                                </button>
                            </div>

                            {/* Warranty */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="number"
                                        name="warrantyPeriod"
                                        value={formData.warrantyPeriod}
                                        onChange={handleInputChange}
                                        placeholder="Warranty period"
                                        min="0"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <select
                                        name="warrantyUnit"
                                        value={formData.warrantyUnit}
                                        onChange={handleInputChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="days">Days</option>
                                        <option value="months">Months</option>
                                        <option value="years">Years</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="warrantyDescription"
                                        value={formData.warrantyDescription}
                                        onChange={handleInputChange}
                                        placeholder="Warranty description"
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            {/* Return Policy */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Policy</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="returnable"
                                            checked={formData.returnable}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 rounded"
                                        />
                                        <span className="text-gray-700">Product is returnable</span>
                                    </label>
                                    {formData.returnable && (
                                        <input
                                            type="number"
                                            name="returnDays"
                                            value={formData.returnDays}
                                            onChange={handleInputChange}
                                            placeholder="Return days"
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(3)}
                                    className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 font-semibold"
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-teal-600 hover:bg-teal-700'
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Creating...
                                        </span>
                                    ) : (
                                        '✅ Create Product'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
