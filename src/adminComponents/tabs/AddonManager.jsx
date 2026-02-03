
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Package, Pencil, X, Image as ImageIcon } from 'lucide-react';
import { addAdminAddon, updateAdminAddon, deleteAdminAddon } from '../../redux/thunks/adminThunk';

function AddonManager() {
    const dispatch = useDispatch();
    const { addons } = useSelector((state) => state.admin);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', description: '', image: null
    });
    const [preview, setPreview] = useState(null);

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ name: '', price: '', description: '', image: null });
        setPreview(null);
    };

    const handleEdit = (addon) => {
        setIsAdding(true);
        setEditingId(addon._id);
        // Fallback for legacy data if needed (addonName/addonPrice vs name/price)
        setFormData({
            name: addon.name || addon.addonName || '',
            price: addon.price || addon.addonPrice || '',
            description: addon.description || '',
            image: null
        });
        if (addon.image) {
            setPreview(addon.image.startsWith('http') ? addon.image : `http://localhost:3001/${addon.image}`);
        } else {
            setPreview(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }

        // Support for legacy backend expectation if necessary (mapping name->addonName if schema was weird, but schema says name)
        // We will send 'name' and 'price' as per schema.

        let res;
        if (editingId) {
            res = await dispatch(updateAdminAddon({ id: editingId, formData: data }));
        } else {
            res = await dispatch(addAdminAddon(data));
        }

        if (!res.error) {
            alert(editingId ? 'Addon Updated Successfully' : 'Addon Created Successfully');
            resetForm();
        } else {
            alert('Failed: ' + (res.payload?.message || res.payload));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Service Addons</h2>
                <button
                    onClick={() => isAdding ? resetForm() : setIsAdding(true)}
                    className={`${isAdding ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800'} text-white px-6 py-2 rounded-full font-bold text-xs transition flex items-center gap-2`}
                >
                    {isAdding ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Create Addon</>}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg mb-8 max-w-2xl relative overflow-hidden">
                    <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Addon' : 'New Addon'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Addon Name (e.g., Extra Wire)"
                            required
                            className="border p-2 rounded-lg"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price (₹)"
                            required
                            className="border p-2 rounded-lg"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                        <div className="md:col-span-2">
                            <textarea
                                placeholder="Description (Optional)"
                                className="border p-2 rounded-lg w-full h-24 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 border p-2 rounded-lg flex items-center gap-2">
                            <div className="p-2 bg-slate-100 rounded">
                                <ImageIcon size={20} className="text-slate-500" />
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            {preview && <img src={preview} alt="Preview" className="h-10 w-10 object-cover rounded ml-auto" />}
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 w-full transition shadow-lg shadow-blue-200">
                        {editingId ? 'Update Addon' : 'Create Addon'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {addons && addons.map((addon) => (
                    <div key={addon._id} className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between overflow-hidden min-h-[180px]">

                        {/* Upper Content */}
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                                {addon.image ? (
                                    <img
                                        src={addon.image.startsWith('http') ? addon.image : `http://localhost:3001/${addon.image}`}
                                        alt={addon.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                    />
                                ) : null}
                                <div className="hidden w-full h-full flex items-center justify-center text-emerald-500 bg-emerald-50" style={{ display: addon.image ? 'none' : 'flex' }}>
                                    <Package size={24} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{addon.name || addon.addonName}</h3>
                                <p className="text-xs text-slate-400 line-clamp-2">{addon.description || 'No description provided.'}</p>
                            </div>
                        </div>

                        {/* Price Tag */}
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="font-black text-lg text-slate-900">₹{addon.price || addon.addonPrice}</span>
                        </div>

                        {/* Action Buttons Overlay */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm backdrop-blur-sm">
                            <button
                                onClick={() => handleEdit(addon)}
                                className="p-1.5 rounded-full text-blue-500 hover:bg-blue-50 transition"
                                title="Edit"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('Delete this addon?')) dispatch(deleteAdminAddon(addon._id));
                                }}
                                className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddonManager;
