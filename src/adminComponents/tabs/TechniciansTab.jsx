import React, { useState } from 'react';
import { Phone, MapPin, UserCheck, Search, Clock, MoreVertical, ShieldCheck, Mail } from 'lucide-react';

const TechniciansTab = ({ vendors, setSelectedVendor, title = "Technician Roster", subTitle = "Manage your fleet of professional partners." }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = vendors.filter(vendor => {
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="bg-secondary p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl text-white group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-primary/20 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Administration</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? "text-primary ml-2" : ""}>{word} </span>
                            ))}
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mt-2 max-w-sm">
                            {subTitle}
                        </p>
                    </div>

                    <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl w-full lg:w-auto min-w-[350px]">
                        <div className="flex items-center px-4 gap-3 flex-1">
                            <Search className="text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, ID or category..."
                                className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-sm font-medium w-full py-2.5"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider whitespace-nowrap">
                            {filteredList.length} RESULTS
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Partner Details</th>
                                <th className="px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Category</th>
                                <th className="px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Contact Info</th>
                                <th className="px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Location</th>
                                <th className="px-6 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">Status</th>
                                <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredList.length > 0 ? filteredList.map((vendor) => (
                                <tr key={vendor._id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-transform group-hover:scale-105 duration-300">
                                                    <img
                                                        src={vendor.vendorPhoto || 'https://placehold.co/150'}
                                                        alt="Partner"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${vendor.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-secondary text-sm">{vendor.firstName} {vendor.lastName}</h4>
                                                    {vendor.isVerified && <ShieldCheck size={14} className="text-primary" />}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: {vendor.customUserId?.split('-').pop() || '#NEW'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="bg-white text-primary text-[10px] font-bold px-3 py-1.5 rounded-full border border-primary/20 uppercase tracking-wide">
                                            {vendor.vendorCategory}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-secondary/80">
                                            <Phone size={12} className="text-slate-400" />
                                            {vendor.userPhone}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 truncate max-w-[180px]">
                                            <Mail size={12} className="text-slate-300" />
                                            {vendor.userEmail}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-secondary/80">
                                            <MapPin size={13} className="text-slate-400" />
                                            {vendor.vendorCity || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {vendor.isVerified ? (
                                            <span className="bg-white text-emerald-600 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200 inline-block min-w-[100px]">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="bg-white text-amber-600 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-amber-200 flex items-center justify-center gap-1.5 w-max mx-auto animate-pulse">
                                                <Clock size={10} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedVendor(vendor)}
                                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all
                                                    ${vendor.isVerified
                                                        ? 'bg-white text-secondary border border-secondary hover:bg-secondary hover:text-white'
                                                        : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white'
                                                    }`}
                                            >
                                                {vendor.isVerified ? 'Profile' : 'Verify Now'}
                                            </button>
                                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="text-slate-300" size={24} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No matches found in database</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TechniciansTab;
