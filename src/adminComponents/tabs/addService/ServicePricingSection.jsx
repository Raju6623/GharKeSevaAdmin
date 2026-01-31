import React from 'react';
import { unitMapping } from '../../constants/serviceConstants';

const ServicePricingSection = ({ formData, handleChange, perUnitRate, setPerUnitRate, mainCategory }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-1">
                <label className="label-text">Original Price (₹)</label>
                <input
                    type="number" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange}
                    placeholder="e.g. 1000" className="input-field text-slate-500"
                />
            </div>
            <div className="sm:col-span-1">
                <label className="label-text">Discount (%)</label>
                <input
                    type="number" name="discount" value={formData.discount || ''} onChange={handleChange}
                    placeholder="e.g. 10" className="input-field text-blue-600 font-bold"
                />
            </div>
            <div className="sm:col-span-1">
                <label className="label-text">Offer Price (₹)</label>
                <input
                    required type="number" name="priceAmount" value={formData.priceAmount || ''} onChange={handleChange}
                    placeholder="Auto-calc" className="input-field font-black text-lg bg-indigo-50/50"
                />
            </div>
            <div className="sm:col-span-1">
                <label className="label-text">Per Unit Rate</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                        type="number"
                        value={perUnitRate}
                        onChange={(e) => setPerUnitRate(e.target.value)}
                        placeholder="499"
                        className="input-field pl-8 pr-20 text-emerald-600 font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                        per {unitMapping[mainCategory] || "UNIT"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ServicePricingSection;
