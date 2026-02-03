import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Image as ImageIcon, Link as LinkIcon, Pencil, X } from 'lucide-react';
import { addAdminBanner, updateAdminBanner, deleteAdminBanner } from '../../redux/thunks/adminThunk';

const BannerManager = () => {
    const dispatch = useDispatch();
    const { banners } = useSelector((state) => state.admin);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', subtitle: '', link: '', tag: 'OFFER', cta: 'Book Now', image: null
    });
    const [preview, setPreview] = useState(null);

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ title: '', subtitle: '', link: '', tag: 'OFFER', cta: 'Book Now', image: null });
        setPreview(null);
    };

    const handleEdit = (banner) => {
        setIsAdding(true);
        setEditingId(banner._id);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle,
            link: banner.link,
            tag: banner.tag,
            cta: banner.cta,
            image: null
        });
        setPreview(banner.image?.startsWith('http') ? banner.image : `http://localhost:3001/${banner.image}`);
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
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) data.append(key, formData[key]);
        });

        let res;
        if (editingId) {
            res = await dispatch(updateAdminBanner({ id: editingId, formData: data }));
        } else {
            res = await dispatch(addAdminBanner(data));
        }

        if (!res.error) {
            alert(editingId ? 'Banner Updated Successfully' : 'Banner Added Successfully');
            resetForm();
        } else {
            alert('Failed: ' + res.payload);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Site Banners</h2>
                <button
                    onClick={() => isAdding ? resetForm() : setIsAdding(true)}
                    className={`${isAdding ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800'} text-white px-6 py-2 rounded-full font-bold text-xs transition flex items-center gap-2`}
                >
                    {isAdding ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add New Banner</>}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Title" required className="border p-2 rounded-lg" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input type="text" placeholder="Subtitle" required className="border p-2 rounded-lg" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                        <input type="text" placeholder="Link Route (e.g., /services/ac)" required className="border p-2 rounded-lg" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                        <input type="text" placeholder="Tag (e.g., LIMITED)" required className="border p-2 rounded-lg" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} />
                        <input type="text" placeholder="CTA Text" required className="border p-2 rounded-lg" value={formData.cta} onChange={e => setFormData({ ...formData, cta: e.target.value })} />
                        <div className="border p-2 rounded-lg flex items-center gap-2">
                            <input type="file" accept="image/*" onChange={handleFileChange} required={!editingId} />
                            {preview && <img src={preview} alt="Preview" className="h-8 w-8 object-cover rounded" />}
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 w-full md:w-auto">
                        {editingId ? 'Update Banner' : 'Publish Banner'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners && banners.map((banner) => (
                    <div key={banner._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm group relative">
                        <img
                            src={banner.image?.startsWith('http') ? banner.image : `http://localhost:3001/${banner.image}`}
                            alt={banner.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md mb-2 inline-block">{banner.tag}</span>
                            <h3 className="font-black text-lg leading-tight mb-1">{banner.title}</h3>
                            <p className="text-slate-500 text-sm mb-3">{banner.subtitle}</p>
                            <div className="flex justify-between items-center text-xs text-slate-400 font-medium bg-slate-50 p-2 rounded-lg">
                                <span className="flex items-center gap-1"><LinkIcon size={12} /> {banner.link}</span>
                                <span className="uppercase">{banner.cta}</span>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(banner)}
                                className="bg-white/90 p-2 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition shadow-sm"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('Delete this banner?')) dispatch(deleteAdminBanner(banner._id));
                                }}
                                className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannerManager;
