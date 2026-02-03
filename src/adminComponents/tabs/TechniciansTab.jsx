
import React, { useState } from 'react';
import { Phone, MapPin, UserCheck, Search } from 'lucide-react';

const TechniciansTab = ({ vendors, setSelectedVendor }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Sort: Pending Verification first
    const allVendorsList = [...vendors]
        .sort((a, b) => (a.isVerified === b.isVerified) ? 0 : a.isVerified ? 1 : -1)
        .filter(vendor => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (
                vendor.firstName?.toLowerCase().includes(term) ||
                vendor.lastName?.toLowerCase().includes(term) ||
                vendor.userPhone?.includes(term) ||
                vendor.userEmail?.toLowerCase().includes(term) ||
                (vendor.customUserId && vendor.customUserId.toLowerCase().includes(term)) ||
                vendor.vendorCategory?.toLowerCase().includes(term)
            );
        });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Technician<br /><span className="text-blue-400">Roster</span></h2>
                        <p className="text-slate-400 font-medium text-sm mt-2 max-w-sm">
                            Manage your fleet of professional partners. Verify new applicants and track active status.
                        </p>
                    </div>

                    <div className="flex bg-white/10 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl w-full lg:w-auto">
                        <div className="flex items-center px-4 gap-3 flex-1">
                            <Search className="text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Find partner by name or ID..."
                                className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-sm font-medium w-full py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider whitespace-nowrap">
                            {allVendorsList.length} ACTIVE
                        </div>
                    </div>
                </div>
            </div>

            {/* List Section - The "ID Card" Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {allVendorsList.length > 0 ? allVendorsList.map((vendor) => (
                    <div key={vendor._id} className="group bg-white p-4 rounded-3xl border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-5 relative overflow-hidden">

                        {/* Dynamic Background Glow on Hover */}
                        <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none 
                            ${vendor.isVerified ? 'bg-blue-100' : 'bg-red-100'}`}></div>

                        {/* Avatar Section */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white relative z-10">
                                <img src={vendor.vendorPhoto || 'https://placehold.co/150'} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            {/* Status Dot */}
                            <div className={`absolute -bottom-1 -right-1 z-20 w-5 h-5 border-2 border-white rounded-full flex items-center justify-center bg-white shadow-sm`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${vendor.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 min-w-0 z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {vendor.customUserId?.split('-').pop() || '#NEW'}</span>
                                {!vendor.isVerified && <span className="bg-red-50 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide animate-pulse">Action Required</span>}
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg leading-tight truncate">{vendor.firstName} {vendor.lastName}</h4>
                            <p className="text-blue-600 font-bold text-xs uppercase tracking-wide mt-0.5">{vendor.vendorCategory}</p>

                            <div className="flex items-center gap-4 mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <Phone size={12} /> {vendor.userPhone}
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <MapPin size={12} /> {vendor.vendorCity || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="z-10 shrink-0">
                            <button
                                onClick={() => setSelectedVendor(vendor)}
                                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 
                                    ${vendor.isVerified
                                        ? 'bg-slate-50 text-slate-400 hover:bg-black hover:text-white'
                                        : 'bg-red-500 text-white hover:bg-red-600 shadow-red-200 animate-bounce-subtle'
                                    }`}
                                title={vendor.isVerified ? "view Profile" : "Verify Now"}
                            >
                                {vendor.isVerified ? <UserCheck size={20} /> : <span className="font-bold text-xs">GO</span>}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-300" size={24} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No partners match your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechniciansTab;
