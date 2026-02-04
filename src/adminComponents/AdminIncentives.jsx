import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Plus, Clock, Target, Calendar, Trash2, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

function AdminIncentives() {
    const [incentives, setIncentives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetCount: '',
        rewardAmount: '',
        validFrom: '',
        validUntil: '',
        applicableCategory: 'ALL'
    });

    const fetchIncentives = async () => {
        setListLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/incentives/all`);
            setIncentives(res.data);
        } catch (error) {
            console.error("Fetch Incentives Error:", error);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        fetchIncentives();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/admin/incentives/${id}`);
            setIncentives(incentives.filter(i => i._id !== id));
        } catch (error) {
            alert("Delete Failed");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("CRITICAL: Delete ALL incentives? This cannot be undone.")) return;
        try {
            await axios.delete(`${API_URL}/admin/incentives/all`);
            setIncentives([]);
            alert("All incentives deleted.");
        } catch (error) {
            alert("Failed to delete all incentives.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/admin/incentives/add`, formData);
            alert("Incentive Created Successfully!");
            setFormData({
                title: '', description: '', targetCount: '', rewardAmount: '', validFrom: '', validUntil: '', applicableCategory: 'ALL'
            });
            fetchIncentives();
        } catch (error) {
            alert("Failed to create incentive.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <Trophy className="text-yellow-500" /> Vendor Incentives
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Form Section */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-fit">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                            <Plus size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Create New Offer</h2>
                            <p className="text-slate-500 text-sm">Motivate vendors with milestone rewards</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Offer Title</label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Weekend Rush Bonus"
                                className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target (Jobs)</label>
                                <div className="relative">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type="number"
                                        value={formData.targetCount}
                                        onChange={e => setFormData({ ...formData, targetCount: e.target.value })}
                                        className="w-full p-4 pl-12 bg-slate-50 rounded-xl font-bold text-slate-700 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                        placeholder="10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reward (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input
                                        required
                                        type="number"
                                        value={formData.rewardAmount}
                                        onChange={e => setFormData({ ...formData, rewardAmount: e.target.value })}
                                        className="w-full p-4 pl-10 bg-slate-50 rounded-xl font-bold text-slate-700 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                        placeholder="500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Starts On</label>
                                <input
                                    required
                                    type="datetime-local"
                                    value={formData.validFrom}
                                    onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expires On</label>
                                <input
                                    required
                                    type="datetime-local"
                                    value={formData.validUntil}
                                    onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief details associated with the offer..."
                                className="w-full p-4 bg-slate-50 rounded-xl font-medium text-slate-600 border-none focus:ring-2 focus:ring-yellow-400 outline-none h-32 resize-none"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black py-4 rounded-xl shadow-lg shadow-yellow-200 transition-all active:scale-95 flex justify-center items-center gap-2"
                        >
                            {loading ? "Creating..." : "Launch Offer 🚀"}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black text-slate-800">Generated Offers ({incentives.length})</h2>
                        {incentives.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-red-100"
                            >
                                <Trash2 size={14} /> Clear All
                            </button>
                        )}
                    </div>

                    {listLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 animate-pulse">
                            <Loader2 className="animate-spin mb-2" />
                            <span className="font-black uppercase tracking-widest text-[10px]">Syncing Data...</span>
                        </div>
                    ) : incentives.length === 0 ? (
                        <div className="py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
                            No incentives generated yet.
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            {incentives.map(item => (
                                <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-start group hover:shadow-md transition-all">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded uppercase">
                                                Active
                                            </span>
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                                ID: {item._id.slice(-6)}
                                            </span>
                                        </div>
                                        <h4 className="font-black text-slate-800 text-lg">{item.title}</h4>
                                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.description}</p>

                                        <div className="mt-4 flex flex-wrap gap-4">
                                            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Target</p>
                                                <p className="text-sm font-black text-slate-700">{item.targetCount} Jobs</p>
                                            </div>
                                            <div className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                                                <p className="text-[10px] font-bold text-emerald-400 uppercase">Reward</p>
                                                <p className="text-sm font-black text-emerald-600">₹{item.rewardAmount}</p>
                                            </div>
                                            <div className="bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                                                <p className="text-[10px] font-bold text-blue-400 uppercase">Expiry</p>
                                                <p className="text-sm font-black text-blue-600">{new Date(item.validUntil).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all ml-4"
                                    >
                                        <Trash2 size={20} />
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

export default AdminIncentives;

