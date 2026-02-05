import React from 'react';
import { Plus, X, Star, ShieldCheck, Lightbulb } from 'lucide-react';
import { API_URL, BASE_URL } from '../../../config';

const ServiceDetailsManager = ({
    variants, setVariants,
    trustContent, setTrustContent,
    tipsContent, setTipsContent,
    trustImageFile, setTrustImageFile,
    tipsImageFile, setTipsImageFile
}) => {

    // Helper to get preview URL
    const getPreview = (file, existingUrl) => {
        if (file) return URL.createObjectURL(file);
        if (existingUrl) {
            return existingUrl.startsWith('http') ? existingUrl : `${BASE_URL}/${existingUrl}`;
        }
        return null;
    };

    // --- Variants Handlers ---
    const addVariant = () => {
        setVariants([...variants, { name: '', price: '', description: '', isRecommended: false }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    // --- Trust Section Handlers ---
    const addTrustPoint = () => {
        setTrustContent({
            ...trustContent,
            points: [...(trustContent.points || []), '']
        });
    };

    const updateTrustPoint = (index, value) => {
        const newPoints = [...(trustContent.points || [])];
        newPoints[index] = value;
        setTrustContent({ ...trustContent, points: newPoints });
    };

    const removeTrustPoint = (index) => {
        const newPoints = (trustContent.points || []).filter((_, i) => i !== index);
        setTrustContent({ ...trustContent, points: newPoints });
    };

    // --- Tips Section Handlers ---
    const addTip = () => {
        setTipsContent({
            ...tipsContent,
            points: [...(tipsContent.points || []), '']
        });
    };

    const updateTip = (index, value) => {
        const newPoints = [...(tipsContent.points || [])];
        newPoints[index] = value;
        setTipsContent({ ...tipsContent, points: newPoints });
    };

    const removeTip = (index) => {
        const newPoints = (tipsContent.points || []).filter((_, i) => i !== index);
        setTipsContent({ ...tipsContent, points: newPoints });
    };

    return (
        <div className="space-y-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Star className="text-amber-500" size={24} />
                Detailed View Content
            </h3>

            {/* 1. VARIANTS MANAGER */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <label className="label-text text-amber-500">Service Variants (Packs)</label>
                    <button type="button" onClick={addVariant} className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-amber-100 transition">
                        <Plus size={14} /> Add Variant
                    </button>
                </div>

                <div className="space-y-4">
                    {variants.map((variant, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl relative border border-slate-100 group hover:border-amber-200 transition-colors">
                            <button type="button" onClick={() => removeVariant(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1">
                                <X size={16} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <input
                                    placeholder="Variant Name (e.g. Standard Pack)"
                                    value={variant.name}
                                    onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                                    className="input-field text-sm"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Price (₹)"
                                        value={variant.price}
                                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                        className="input-field text-sm w-32"
                                    />
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 rounded-xl border border-slate-200 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={variant.isRecommended}
                                            onChange={(e) => updateVariant(idx, 'isRecommended', e.target.checked)}
                                        />
                                        Recommended
                                    </label>
                                </div>
                            </div>
                            <textarea
                                placeholder="Description (e.g. Essential service with quality products)"
                                value={variant.description}
                                onChange={(e) => updateVariant(idx, 'description', e.target.value)}
                                className="input-field text-sm resize-none"
                                rows="2"
                            />
                        </div>
                    ))}
                    {variants.length === 0 && <p className="text-center text-xs text-slate-400 italic py-4">No variants added. Standard price will be used.</p>}
                </div>
            </div>

            {/* 2. TRUST CONTENT MANAGER */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <label className="label-text text-indigo-500">Trust Section</label>
                    <ShieldCheck size={18} className="text-indigo-400" />
                </div>

                <div className="flex gap-4 items-start mb-6">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Trust Image</label>
                        <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 transition-colors aspect-video flex items-center justify-center cursor-pointer">
                            {getPreview(trustImageFile, trustContent.image) ? (
                                <img src={getPreview(trustImageFile, trustContent.image)} alt="Trust" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <Plus size={20} />
                                    <span className="text-[9px] font-bold">Upload Image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setTrustImageFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {trustContent.image && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                    Change Image
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-[2] space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Trust Title</label>
                            <input
                                placeholder="e.g. Why choose us?"
                                value={trustContent.title || ''}
                                onChange={(e) => setTrustContent({ ...trustContent, title: e.target.value })}
                                className="input-field text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Points</label>
                    {(trustContent.points || []).map((point, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                value={point}
                                onChange={(e) => updateTrustPoint(idx, e.target.value)}
                                className="input-field py-2 text-sm"
                                placeholder="Trust Point..."
                            />
                            <button type="button" onClick={() => removeTrustPoint(idx)} className="text-slate-300 hover:text-red-500"><X size={18} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={addTrustPoint} className="text-xs text-indigo-500 font-bold flex items-center gap-1 mt-2">
                        <Plus size={14} /> Add Point
                    </button>
                </div>
            </div>

            {/* 3. AFTERCARE TIPS MANAGER */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <label className="label-text text-emerald-500">Aftercare Tips</label>
                    <Lightbulb size={18} className="text-emerald-400" />
                </div>

                <div className="flex gap-4 items-start mb-6">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tips Image</label>
                        <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-emerald-400 transition-colors aspect-video flex items-center justify-center cursor-pointer">
                            {getPreview(tipsImageFile, tipsContent.image) ? (
                                <img src={getPreview(tipsImageFile, tipsContent.image)} alt="Tips" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <Plus size={20} />
                                    <span className="text-[9px] font-bold">Upload Image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setTipsImageFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {tipsContent.image && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                    Change Image
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-[2] space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tips Title</label>
                            <input
                                placeholder="e.g. Maintenance Tips"
                                value={tipsContent.title || ''}
                                onChange={(e) => setTipsContent({ ...tipsContent, title: e.target.value })}
                                className="input-field text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Points</label>
                    {(tipsContent.points || []).map((point, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                value={point}
                                onChange={(e) => updateTip(idx, e.target.value)}
                                className="input-field py-2 text-sm"
                                placeholder="Tip..."
                            />
                            <button type="button" onClick={() => removeTip(idx)} className="text-slate-300 hover:text-red-500"><X size={18} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={addTip} className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-2">
                        <Plus size={14} /> Add Tip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsManager;
