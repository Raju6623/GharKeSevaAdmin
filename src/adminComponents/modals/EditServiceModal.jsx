import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import ServiceDetailsManager from '../tabs/addService/ServiceDetailsManager';

const EditServiceModal = ({ service, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        packageName: '',
        serviceCategory: '',
        priceAmount: '',
        discount: '0',
        tag: '',
        rating: '4.8',
        reviewCount: '0',
        description: '',
        estimatedTime: '',
        originalPrice: '',
        category: '' // Added this
    });
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Detailed States
    const [variants, setVariants] = useState([]);
    const [trustContent, setTrustContent] = useState({ title: '', points: [], image: '' });
    const [tipsContent, setTipsContent] = useState({ title: '', points: [] });
    const [trustImageFile, setTrustImageFile] = useState(null);
    const [tipsImageFile, setTipsImageFile] = useState(null);

    useEffect(() => {
        if (service) {
            setFormData({
                packageName: service.packageName || '',
                serviceCategory: service.serviceCategory || '',
                priceAmount: service.priceAmount || '',
                discount: service.discount || '0',
                tag: service.tag || '',
                rating: service.rating || '4.8',
                reviewCount: service.reviewCount || '0',
                description: service.description || '',
                estimatedTime: service.estimatedTime || '',
                originalPrice: service.originalPrice || '',
                category: service.category || '' // Added this
            });

            if (service.packageImage) {
                setPreview(service.packageImage.startsWith('http')
                    ? service.packageImage
                    : `http://localhost:3001/${service.packageImage}`);
            }

            // Load Detailed Content
            setVariants(service.variants || []);
            setTrustContent(service.trustContent || { title: '', points: [], image: '' });
            setTipsContent(service.aftercareTips || { title: '', points: [] });
        }
    }, [service]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (imageFile) {
            data.append('packageImage', imageFile);
        }
        if (trustImageFile) {
            data.append('trustImage', trustImageFile);
        }
        if (tipsImageFile) {
            data.append('tipsImage', tipsImageFile);
        }

        // Add Detailed Content
        data.append('variants', JSON.stringify(variants));
        data.append('trustContent', JSON.stringify(trustContent));
        data.append('aftercareTips', JSON.stringify(tipsContent));

        await onUpdate(service._id, data, formData.category || service.serviceCategory);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Edit Service</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <div className="relative group cursor-pointer w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50 hover:border-blue-500 transition-colors">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-xs font-bold uppercase">Upload New Image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                                Change Image
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Service Name</label>
                            <input
                                type="text"
                                name="packageName"
                                value={formData.packageName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {['AC', 'Plumbing', 'Electrician', 'Carpenter', 'RO', 'Salon', 'HouseMaid', 'Painting', 'Smart Lock', 'Appliances'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Sub-Category</label>
                            <input
                                type="text"
                                name="serviceCategory"
                                value={formData.serviceCategory}
                                onChange={handleChange}
                                placeholder="e.g. Split AC, Facial & Cleanup"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Estimated Time</label>
                            <input
                                type="text"
                                name="estimatedTime"
                                value={formData.estimatedTime}
                                onChange={handleChange}
                                placeholder="e.g. 45-60 mins"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                            <input
                                type="number"
                                name="priceAmount"
                                value={formData.priceAmount}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Discount (%)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Tag (e.g. Bestseller)</label>
                            <input
                                type="text"
                                name="tag"
                                value={formData.tag}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Detailed Content Manager */}
                    <div className="border-t border-slate-100 pt-6">
                        <ServiceDetailsManager
                            variants={variants} setVariants={setVariants}
                            trustContent={trustContent} setTrustContent={setTrustContent}
                            tipsContent={tipsContent} setTipsContent={setTipsContent}
                            trustImageFile={trustImageFile}
                            setTrustImageFile={setTrustImageFile}
                            tipsImageFile={tipsImageFile}
                            setTipsImageFile={setTipsImageFile}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <CheckCircle size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceModal;
