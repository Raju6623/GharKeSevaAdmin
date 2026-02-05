import React, { useState, useEffect } from 'react';
import { Crown, Save, RefreshCcw, Info, Trash2, Plus, GripVertical, Eye, EyeOff, Palette } from 'lucide-react';
import api from '../../api/axiosConfig';

function MembershipTab() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePlan, setActivePlan] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/membership/plans');
            if (res.data) {
                setPlans(res.data);
                if (res.data.length > 0) setActivePlan(res.data[0]);
                else createNewPlanTemplate();
            }
        } catch (err) {
            console.error("Failed to fetch membership plans", err);
            setMessage({ type: 'error', text: 'Failed to load plans' });
        } finally {
            setLoading(false);
        }
    };

    const createNewPlanTemplate = () => {
        const newPlan = {
            planName: 'New Plan',
            title: 'Elite Membership',
            subtitle: 'Save 3X more on services',
            tagline: 'Priority Support & Deals',
            price: 249,
            isActive: true,
            color: '#f59e0b',
            order: plans.length
        };
        setActivePlan(newPlan);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const res = await api.put('/admin/membership/plans', activePlan);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Plan saved successfully!' });
                fetchPlans(); // Refresh list
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Save failed: ' + (err.response?.data?.message || err.message) });
        }
    };

    const handleDelete = async (planId) => {
        if (!planId) {
            createNewPlanTemplate();
            return;
        }
        if (!window.confirm("Are you sure you want to delete this plan?")) return;
        try {
            await api.delete(`/admin/membership/plans/${planId}`);
            setMessage({ type: 'success', text: 'Plan deleted.' });
            fetchPlans();
        } catch (err) {
            setMessage({ type: 'error', text: 'Delete failed.' });
        }
    };

    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        setActivePlan(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'order' ? Number(value) : value)
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCcw className="animate-spin text-primary mb-4" size={40} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Plans...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Membership Ecosystem</h2>
                    <p className="text-slate-500 font-medium">Create and manage multiple membership tiers with horizontal auto-scroll.</p>
                </div>
                <button
                    onClick={createNewPlanTemplate}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20"
                >
                    <Plus size={18} /> ADD NEW TIER
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
                    }`}>
                    <Info size={18} />
                    <p className="font-bold text-sm">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Plans List Sidebar */}
                <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Your Plans</h3>
                    {plans.map((plan, idx) => (
                        <div
                            key={plan._id || idx}
                            onClick={() => setActivePlan(plan)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${activePlan?._id === plan._id || (!activePlan?._id && activePlan?.planName === plan.planName)
                                ? 'bg-white border-primary shadow-lg shadow-primary/10'
                                : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: plan.color }}></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{plan.planName}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">₹{plan.price}</p>
                                </div>
                            </div>
                            <div className={plan.isActive ? 'text-emerald-500' : 'text-slate-300'}>
                                {plan.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor Content */}
                <div className="lg:col-span-3">
                    {activePlan && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <form onSubmit={handleSave} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight italic">
                                        Editing: {activePlan.planName}
                                    </h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={activePlan.isActive}
                                            onChange={handleFieldChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Plan Internal Name</label>
                                        <input
                                            type="text"
                                            name="planName"
                                            value={activePlan.planName}
                                            onChange={handleFieldChange}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Theme Color</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                name="color"
                                                value={activePlan.color}
                                                onChange={handleFieldChange}
                                                className="w-12 h-11 p-1 bg-white border-2 border-slate-100 rounded-xl cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                name="color"
                                                value={activePlan.color}
                                                onChange={handleFieldChange}
                                                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={activePlan.title}
                                            onChange={handleFieldChange}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price (₹)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={activePlan.price}
                                                onChange={handleFieldChange}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Order</label>
                                            <input
                                                type="number"
                                                name="order"
                                                value={activePlan.order}
                                                onChange={handleFieldChange}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description Item 1</label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={activePlan.subtitle}
                                        onChange={handleFieldChange}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description Item 2</label>
                                    <input
                                        type="text"
                                        name="tagline"
                                        value={activePlan.tagline}
                                        onChange={handleFieldChange}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <Save size={18} /> SAVE PLAN
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(activePlan._id)}
                                        className="px-6 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl border border-red-100 transition-all active:scale-95"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </form>

                            {/* Preview Card */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                                    Live Mobile Preview
                                </h4>
                                <div
                                    className="rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500 group border-[8px] border-slate-100"
                                    style={{ backgroundColor: activePlan.color || '#0f172a' }}
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-1000"></div>

                                    <div className="flex items-center justify-between relative z-10 mb-8 mt-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center text-white text-2xl font-black border border-white/20 shadow-inner backdrop-blur-md">
                                                {activePlan.title?.charAt(0) || 'M'}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white text-xl italic tracking-tight">{activePlan.title || 'Membership'}</h4>
                                                <p className="text-xs text-white/70 font-bold">{activePlan.subtitle || 'Premium access'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pl-1 relative z-10 mb-2">
                                        <p className="text-xs text-white/80 font-black uppercase tracking-widest">{activePlan.tagline || 'Extra Benefits'}</p>
                                        <div className="px-5 py-2.5 bg-white text-slate-900 text-xs font-black rounded-2xl shadow-xl shadow-black/10 transition-transform active:scale-90">
                                            ₹{activePlan.price || '0'}
                                        </div>
                                    </div>

                                    {!activePlan.isActive && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center text-center p-6">
                                            <EyeOff size={40} className="text-slate-400 mb-2" />
                                            <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">Plan Hidden</p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 text-amber-800 text-xs space-y-2">
                                    <p className="font-black flex items-center gap-2 uppercase tracking-widest mb-4">
                                        <Palette size={14} /> Color Tips
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setActivePlan(p => ({ ...p, color: '#0f172a' }))} className="p-2 bg-[#0f172a] text-white rounded-lg font-bold">Midnight</button>
                                        <button onClick={() => setActivePlan(p => ({ ...p, color: '#f59e0b' }))} className="p-2 bg-[#f59e0b] text-white rounded-lg font-bold">Amber Gold</button>
                                        <button onClick={() => setActivePlan(p => ({ ...p, color: '#0c8182' }))} className="p-2 bg-[#0c8182] text-white rounded-lg font-bold">GKS Teal</button>
                                        <button onClick={() => setActivePlan(p => ({ ...p, color: '#7c3aed' }))} className="p-2 bg-[#7c3aed] text-white rounded-lg font-bold">Royal Purple</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default MembershipTab;
