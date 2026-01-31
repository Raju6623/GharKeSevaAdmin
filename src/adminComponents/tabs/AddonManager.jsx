import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Package } from 'lucide-react';
import { addAdminAddon, deleteAdminAddon } from '../../redux/thunks/adminThunk';

function AddonManager() {
    const dispatch = useDispatch();
    const { addons } = useSelector((state) => state.admin);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        addonName: '', addonPrice: '', description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(addAdminAddon(formData));
        if (!res.error) {
            alert('Addon Created Successfully');
            setIsAdding(false);
            setFormData({ addonName: '', addonPrice: '', description: '' });
        } else {
            alert('Failed: ' + res.payload);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Service Addons</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-slate-800 transition flex items-center gap-2"
                >
                    <Plus size={16} /> {isAdding ? 'Cancel' : 'Create Addon'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg mb-8 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Addon Name (e.g., Extra Wire)" required className="border p-2 rounded-lg" value={formData.addonName} onChange={e => setFormData({ ...formData, addonName: e.target.value })} />
                        <input type="number" placeholder="Price (₹)" required className="border p-2 rounded-lg" value={formData.addonPrice} onChange={e => setFormData({ ...formData, addonPrice: e.target.value })} />
                        <div className="md:col-span-2">
                            <textarea
                                placeholder="Description (Optional)"
                                className="border p-2 rounded-lg w-full h-24 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 w-full">Create Addon</button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {addons && addons.map((addon) => (
                    <div key={addon._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group relative flex flex-col justify-between h-40">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <Package size={20} />
                                </div>
                                <span className="font-black text-lg text-slate-900">₹{addon.addonPrice}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 leading-tight mb-1">{addon.addonName}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2">{addon.description || 'No description provided.'}</p>
                        </div>

                        <button
                            onClick={() => {
                                if (window.confirm('Delete this addon?')) dispatch(deleteAdminAddon(addon._id));
                            }}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddonManager;
