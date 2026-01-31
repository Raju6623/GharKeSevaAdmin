import React from 'react';
import { Phone, MapPin, UserCheck } from 'lucide-react';

const TechniciansTab = ({ vendors, setSelectedVendor }) => {
    // Sort: Pending Verification first, and only show Online vendors as per previous implementation logic
    const allVendorsList = [...vendors]
        .filter(v => v.isOnline === true)
        .sort((a, b) => (a.isVerified === b.isVerified) ? 0 : a.isVerified ? 1 : -1);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Partner Network</h2>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Online Partners: {allVendorsList.length}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allVendorsList.length > 0 ? allVendorsList.map((vendor) => (
                    <div key={vendor._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl relative group hover:-translate-y-1 transition-all">
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            {vendor.isOnline && (
                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
                                </span>
                            )}
                            {!vendor.isVerified && <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded-md">Pending</span>}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <img src={vendor.vendorPhoto || 'https://placehold.co/150'} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 shadow-sm" />
                            <div>
                                <h4 className="font-black text-slate-900 text-lg leading-tight">{vendor.firstName} {vendor.lastName}</h4>
                                <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">{vendor.vendorCategory}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-6 text-slate-500 text-xs font-bold uppercase">
                            <div className="flex items-center gap-2"><Phone size={14} /> {vendor.userPhone}</div>
                            <div className="flex items-center gap-2"><MapPin size={14} /> {vendor.vendorCity || 'N/A'}</div>
                        </div>
                        <button
                            onClick={() => setSelectedVendor(vendor)}
                            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${vendor.isVerified ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-red-500 text-white hover:bg-red-600 animate-pulse'}`}
                        >
                            {vendor.isVerified ? 'View Profile' : 'Verify Now'}
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <UserCheck size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No partners registered yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechniciansTab;
