import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Ticket, Trash2, Plus, Loader2, X } from 'lucide-react';
import { API_URL } from '../config';

function AdminCoupons({ isEmbedded = false }) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'FLAT', // or PERCENTAGE
        discountValue: '',
        maxDiscount: '', // Optional for percentage
        minOrderValue: '',
        description: '',
        termsConditions: [] // New State
    });
    const [newTerm, setNewTerm] = useState(""); // Temp input for adding terms

    const fetchCoupons = () => {
        setLoading(true);
        axios.get(`${API_URL}/coupons`)
            .then(res => setCoupons(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await axios.delete(`${API_URL}/admin/coupons/${id}`);
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (error) {
            alert("Failed to delete coupon");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Delete ALL platform coupons?")) return;
        try {
            await axios.delete(`${API_URL}/admin/coupons/all`);
            setCoupons([]);
            alert("All coupons deleted.");
        } catch (error) {
            alert("Failed to delete all coupons.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        // Sanitize Payload
        const payload = {
            ...formData,
            discountValue: parseFloat(formData.discountValue),
            minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : 0,
            maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined
        };

        try {
            const res = await axios.post(`${API_URL}/admin/coupons/add`, payload);
            if (res.data.success) {
                setCoupons([res.data.data, ...coupons]);
                setFormData({
                    code: '', discountType: 'FLAT', discountValue: '', maxDiscount: '', minOrderValue: '', description: '', termsConditions: []
                });
                setNewTerm("");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create coupon. Code might be duplicate or invalid data.");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className={isEmbedded ? "" : "p-6"}>
            {!isEmbedded && (
                <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <Ticket className="text-indigo-600" /> Coupon Manager
                </h1>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Coupon</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Coupon Code</label>
                                <input
                                    required
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g. SUMMER2026"
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none"
                                    >
                                        <option value="FLAT">Flat ₹</option>
                                        <option value="PERCENTAGE">% Off</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Value</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                        placeholder={formData.discountType === 'FLAT' ? "₹ Amount" : "% Value"}
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                <input
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief details..."
                                    className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Terms Builder */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Terms & Conditions</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={newTerm}
                                        onChange={e => setNewTerm(e.target.value)}
                                        placeholder="Add a condition (e.g. New Users Only)"
                                        className="flex-1 p-2 bg-slate-50 rounded-lg text-sm border-none outline-none"
                                        onKeyPress={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newTerm.trim()) {
                                                    setFormData({ ...formData, termsConditions: [...formData.termsConditions, newTerm.trim()] });
                                                    setNewTerm("");
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newTerm.trim()) {
                                                setFormData({ ...formData, termsConditions: [...formData.termsConditions, newTerm.trim()] });
                                                setNewTerm("");
                                            }
                                        }}
                                        className="bg-slate-200 p-2 rounded-lg text-slate-600 hover:bg-slate-300"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                {/* List of added terms */}
                                <div className="space-y-1">
                                    {formData.termsConditions.map((term, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs bg-slate-100 px-2 py-1 rounded">
                                            <span>• {term}</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    termsConditions: formData.termsConditions.filter((_, i) => i !== idx)
                                                })}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Min Order</label>
                                    <input
                                        type="number"
                                        value={formData.minOrderValue}
                                        onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })}
                                        placeholder="Min ₹"
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none"
                                    />
                                </div>
                                {formData.discountType === 'PERCENTAGE' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Disc.</label>
                                        <input
                                            type="number"
                                            value={formData.maxDiscount}
                                            onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                                            placeholder="Max ₹"
                                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border-none outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                disabled={formLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2 active:scale-95 mt-4"
                            >
                                {formLoading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Create Coupon</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List View */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">Active Coupons ({coupons.length})</h2>
                        {coupons.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                            >
                                <Trash2 size={14} className="inline mr-1" /> Delete All
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <div className="p-10 text-center text-slate-400">Loading details...</div>
                    ) : coupons.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                            No active coupons. Create one!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coupons.map(coupon => (
                                <div key={coupon._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start group hover:shadow-md transition-all">
                                    <div>
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider inline-block mb-2 border border-green-200">
                                            {coupon.code}
                                        </div>
                                        <div className="font-bold text-slate-800 text-lg">
                                            {coupon.discountType === 'FLAT' ? `Flat ₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`}
                                        </div>
                                        <p className="text-slate-500 text-sm mt-1">{coupon.description}</p>
                                        <div className="text-xs text-slate-400 mt-3 font-medium flex gap-3">
                                            <span>Min: ₹{coupon.minOrderValue}</span>
                                            {coupon.maxDiscount && <span>Max Disc: ₹{coupon.maxDiscount}</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCoupons;
