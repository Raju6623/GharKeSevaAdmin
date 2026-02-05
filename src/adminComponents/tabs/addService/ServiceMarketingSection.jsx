import React from 'react';
import { Tag } from 'lucide-react';

const ServiceMarketingSection = ({ formData, handleChange }) => {
    return (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
                <Tag size={18} />
                <h3 className="font-bold text-xs uppercase tracking-wide">Visuals & Marketing (Optional)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="label-text">Star Rating</label>
                    <input
                        type="number" step="0.1" name="rating" value={formData.rating || ''} onChange={handleChange}
                        placeholder="4.8" className="input-field"
                    />
                </div>
                <div>
                    <label className="label-text">Review Count</label>
                    <input
                        name="reviewCount" value={formData.reviewCount || ''} onChange={handleChange}
                        placeholder="e.g. 7.5K" className="input-field"
                    />
                </div>
                <div className="sm:col-span-1">
                    <label className="label-text">Badge Tag</label>
                    <input
                        name="tag" value={formData.tag || ''} onChange={handleChange}
                        placeholder="e.g. Bestseller" className="input-field"
                    />
                </div>
            </div>
        </div>
    );
};

export default ServiceMarketingSection;
