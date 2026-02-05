import React, { useState, useEffect } from 'react';
import { Coins, Save, RefreshCcw, Info, Gift, UserPlus, Star } from 'lucide-react';
import api from '../../api/axiosConfig';

function RewardsTab() {
    const [settings, setSettings] = useState({
        referralSenderCoins: 20,
        referralSenderGsCoins: 50,
        bookingLoyaltyCoins: 20,
        signupBonusCoins: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/rewards/settings');
            if (res.data && res.data.success) {
                // Remove mongodb fields if any
                const { _id, __v, createdAt, updatedAt, ...cleanData } = res.data;
                setSettings(cleanData);
            }
        } catch (err) {
            console.error("Failed to fetch reward settings", err);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.put('/admin/rewards/settings', settings);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Reward settings updated successfully!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Update failed: ' + (err.response?.data?.message || err.message) });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: Number(value) }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <RefreshCcw className="animate-spin text-primary mb-4" size={40} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Economy Settings...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reward Ecosystem</h2>
                    <p className="text-slate-500 font-medium">Configure real-time coin rewards for user actions and loyalty.</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-2xl flex items-center gap-2 border border-primary/20">
                    <Coins size={20} className="text-primary" />
                    <span className="text-primary font-black text-sm uppercase tracking-wider">Economy Control</span>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
                    }`}>
                    <Info size={18} />
                    <p className="font-bold text-sm">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Booking Loyalty Card */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                            <Star size={28} className="fill-indigo-100" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">Booking Loyalty</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Per Booking Reward</p>
                        </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                        Specify how many <span className="text-indigo-600 font-bold">GS Coins</span> a user receives immediately after successfully placing a service request.
                    </p>

                    <div className="relative">
                        <input
                            type="number"
                            name="bookingLoyaltyCoins"
                            value={settings.bookingLoyaltyCoins}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                            placeholder="e.g. 20"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm uppercase tracking-wider">Coins</span>
                    </div>
                </div>

                {/* Referral Rewards Section */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-500">
                            <Gift size={28} className="fill-amber-100" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">Referral Payouts</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Double-Sided Benefits</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Referrer Reward (Cashback/Coins)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="referralSenderCoins"
                                    value={settings.referralSenderCoins}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-black text-slate-900 focus:border-amber-500 focus:bg-white transition-all outline-none"
                                    placeholder="20"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-wider italic">Refer Coins</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Referrer Bonus (GS Coins)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="referralSenderGsCoins"
                                    value={settings.referralSenderGsCoins}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-black text-slate-900 focus:border-amber-500 focus:bg-white transition-all outline-none"
                                    placeholder="50"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-wider italic">GS Coins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signup Bonus Card */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform duration-500">
                            <UserPlus size={28} className="fill-rose-100" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">Welcome Bonus</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Growth Incentive</p>
                        </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                        Reward new users with a one-time <span className="text-rose-600 font-bold">Registration Bonus</span> to encourage their first booking.
                    </p>

                    <div className="relative">
                        <input
                            type="number"
                            name="signupBonusCoins"
                            value={settings.signupBonusCoins}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 focus:border-rose-500 focus:bg-white transition-all outline-none"
                            placeholder="0"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm uppercase tracking-wider">Welcome Coins</span>
                    </div>
                </div>

                {/* Save Section */}
                <div className="bg-slate-900 rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full -ml-16 -mb-16 blur-3xl opacity-50"></div>

                    <Coins size={48} className="text-primary mb-6 animate-pulse" />
                    <h3 className="text-xl font-black text-white mb-4">Commit Changes</h3>
                    <p className="text-slate-400 text-sm mb-8 max-w-xs">
                        Updates will be applied <span className="text-white font-bold italic underline">instantly</span> to all new bookings and user actions across the platform.
                    </p>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? (
                            <RefreshCcw className="animate-spin" size={20} />
                        ) : (
                            <Save size={20} />
                        )}
                        {saving ? 'UPDATING...' : 'PUBLISH SETTINGS'}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default RewardsTab;
