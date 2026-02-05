import React from 'react';
import { PlusCircle } from 'lucide-react';

const ServiceFormHeader = ({ serviceType, onTypeChange }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <PlusCircle size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Service</h2>
        </div>

        {/* Service Type Dropdown */}
        <div className="relative">
            <select
                value={serviceType}
                onChange={(e) => onTypeChange(e.target.value)}
                className="appearance-none bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 pl-4 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            >
                <option value="service">Standard Service</option>
                <option value="package">Service Package</option>
                <option value="bestseller">Best Seller Deal</option>
                <option value="limited">Limited Offer</option>
                <option value="coupon">Discount Coupon</option>
                <option value="vendoroffer">Vendor Offer</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>
    </div>
);

export default ServiceFormHeader;
