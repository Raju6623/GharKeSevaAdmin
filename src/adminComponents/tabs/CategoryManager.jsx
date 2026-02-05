
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, MoveUp, MoveDown, LayoutGrid, X, Check } from 'lucide-react';
import { fetchAdminCategories, addAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../redux/thunks/adminThunk';
import { getImageUrl } from '../../config';

const CategoryManager = () => {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector((state) => state.admin);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '',
        tag: '',
        link: '',
        modalKey: '',
        order: 0
    });

    useEffect(() => {
        dispatch(fetchAdminCategories());
    }, [dispatch]);

    const handleSave = async () => {
        if (!formData.name) return alert('Name is required');

        if (editingId) {
            await dispatch(updateAdminCategory({ id: editingId, data: formData }));
            setEditingId(null);
        } else {
            await dispatch(addAdminCategory(formData));
            setIsAdding(false);
        }
        setFormData({ name: '', icon: '', tag: '', link: '', modalKey: '', order: 0 });
    };

    const handleEdit = (cat) => {
        setEditingId(cat._id);
        setFormData({
            name: cat.name,
            icon: cat.icon || '',
            tag: cat.tag || '',
            link: cat.link || '',
            modalKey: cat.modalKey || '',
            order: cat.order || 0
        });
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this category?')) {
            dispatch(deleteAdminCategory(id));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-8 rounded-[2rem] shadow-2xl text-white flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Category <span className="text-teal-400">Manager</span></h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">Manage home page service categories and icons.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 animate-in slide-in-from-top duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">{editingId ? 'Edit' : 'New'} Category</h3>
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="label-text">Category Name (Display)</label>
                            <input
                                className="input-field"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Salon for Women"
                            />
                        </div>
                        <div>
                            <label className="label-text">Icon Path (3D Icon)</label>
                            <input
                                className="input-field"
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="e.g. /3d-icons/salon_3d.png"
                            />
                        </div>
                        <div>
                            <label className="label-text">Badge / Tag (Optional)</label>
                            <input
                                className="input-field"
                                value={formData.tag}
                                onChange={e => setFormData({ ...formData, tag: e.target.value })}
                                placeholder="e.g. NEW or SALE"
                            />
                        </div>
                        <div>
                            <label className="label-text">Navigation Link</label>
                            <input
                                className="input-field"
                                value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                                placeholder="e.g. /services/salon-for-women"
                            />
                        </div>
                        <div>
                            <label className="label-text">Modal Key (If used)</label>
                            <input
                                className="input-field"
                                value={formData.modalKey}
                                onChange={e => setFormData({ ...formData, modalKey: e.target.value })}
                                placeholder="e.g. Salon"
                            />
                        </div>
                        <div>
                            <label className="label-text">Sort Order</label>
                            <input
                                type="number"
                                className="input-field"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">Cancel</button>
                        <button onClick={handleSave} className="px-8 py-3 rounded-xl bg-teal-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-teal-700 shadow-lg shadow-teal-600/20">
                            <Check size={18} /> {editingId ? 'Update' : 'Save'} Category
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat._id} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-teal-100 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-4 relative overflow-hidden">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                            {cat.icon ? <img src={getImageUrl(cat.icon)} alt={cat.name} className="w-12 h-12 object-contain" /> : <LayoutGrid className="text-slate-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#0c8182]">Pos: {cat.order}</span>
                                {cat.tag && <span className="bg-teal-100 text-[#0c8182] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{cat.tag}</span>}
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg leading-tight truncate">{cat.name}</h4>
                            <p className="text-slate-400 text-[10px] truncate font-medium">{cat.link || `Modal: ${cat.modalKey}`}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleEdit(cat)} className="p-2 bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(cat._id)} className="p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && !loading && (
                <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No categories found. Click "Add Category" to start.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
