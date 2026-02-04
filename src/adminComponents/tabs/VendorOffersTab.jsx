import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag, Trash2, Plus, Loader2, Image as ImageIcon, Percent, Users } from 'lucide-react';
import { API_URL, getImageUrl } from '../../config';

const VendorOffersTab = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountValue: '',
        validFrom: '',
        validUntil: '',
        category: '', // TARGET CATEGORY
        vendorId: '', // TARGET VENDOR (OPTIONAL)
        offerImage: null
    });

    const categories = [
        "AC", "Salon", "Plumbing", "Electrician", "Carpenter",
        "RO", "House Maid", "Painting", "Smart Lock", "Appliances"
    ];

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/coupons/all/public`);
            setOffers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/vendor/coupons/${id}`);
            setOffers(offers.filter(o => o._id !== id));
        } catch (error) {
            alert("Delete Failed");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("CRITICAL: This will delete ALL vendor offers from the system. This cannot be undone. Are you absolutely sure?")) return;
        try {
            await axios.delete(`${API_URL}/vendor/coupons/all`);
            setOffers([]);
            alert("All offers deleted successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to delete all offers.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        try {
            await axios.post(`${API_URL}/vendor/coupons/add`, data);
            fetchOffers();
            setFormData({ code: '', description: '', discountValue: '', validFrom: '', validUntil: '', category: '', vendorId: '', offerImage: null });
        } catch (error) {
            alert("Failed to create offer");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Percent className="text-indigo-600" /> Vendor Offers & Deals
                    </h2>
                    <p className="text-slate-500 text-sm">Create category-wide or vendor-specific offers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creation Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
                        <h3 className="font-bold text-lg mb-6 text-slate-700">New Offer Creation</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Coupon Code</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. ACPRO50"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Discount amount (₹)</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="e.g. 150"
                                    value={formData.discountValue}
                                    onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    required
                                    rows="2"
                                    placeholder="Special discount for AC Masters..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starts On</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={formData.validFrom}
                                        onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expires On</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={formData.validUntil}
                                        onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Vendor ID (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. VND-1001"
                                    value={formData.vendorId}
                                    onChange={e => setFormData({ ...formData, vendorId: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Offer Image</label>
                                <label className="cursor-pointer bg-slate-100 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-200 transition border-2 border-dashed border-slate-200">
                                    <ImageIcon size={18} />
                                    <span className="text-xs font-bold">{formData.offerImage ? formData.offerImage.name : "Upload Banner"}</span>
                                    <input type="file" hidden onChange={e => setFormData({ ...formData, offerImage: e.target.files[0] })} />
                                </label>
                            </div>

                            <button
                                disabled={formLoading}
                                className="w-full bg-indigo-600 text-white p-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
                            >
                                {formLoading ? <Loader2 className="animate-spin mx-auto" /> : "Publish to Vendors"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Offers List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Active Offers ({offers.length})</h3>
                        {offers.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-colors border border-red-100"
                            >
                                <Trash2 size={14} /> Delete All
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <div className="text-center py-20 animate-pulse text-slate-300 font-black uppercase tracking-tighter">Fetching Active Deals...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {offers.map(offer => (
                                <div key={offer._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                {offer.category || "All Categories"}
                                            </span>
                                            {offer.vendorId && (
                                                <span className="ml-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                                    ID: {offer.vendorId}
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(offer._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <h4 className="text-xl font-black text-slate-800 tracking-tight mb-1">{offer.code}</h4>
                                    <p className="text-slate-500 text-sm font-medium leading-tight mb-4">{offer.description}</p>

                                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Discount</span>
                                            <span className="text-sm font-black text-indigo-600">₹{offer.discountValue} OFF</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Expires</span>
                                            <span className="text-sm font-black text-slate-700">{new Date(offer.validUntil).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorOffersTab;
