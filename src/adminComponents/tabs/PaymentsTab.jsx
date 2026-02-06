import React, { useState } from 'react';
import { IndianRupee, CreditCard, Search, CheckCircle2, Clock } from 'lucide-react';

const PaymentsTab = ({ recentBookings }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, SETTLED, PENDING

    const completedBookings = recentBookings.filter(b => b.bookingStatus === 'Completed');

    const filteredBookings = completedBookings.filter(b => {
        const matchesSearch = b.customBookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.assignedVendorId?.toLowerCase().includes(searchTerm.toLowerCase());

        const status = b.settlementStatus || 'PENDING';
        const matchesFilter = filterStatus === 'ALL' || status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-secondary tracking-tight">Financial Settlements</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Track payouts to vendors for completed orders</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Real-time sync</span>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['ALL', 'SETTLED', 'PENDING'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status
                                    ? 'bg-secondary text-white shadow-lg'
                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Vendor ID..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredBookings.length > 0 ? filteredBookings.map((pay) => (
                    <div key={pay._id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${(pay.settlementStatus || 'PENDING') === 'SETTLED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                <IndianRupee size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-secondary text-lg">Order #{pay.customBookingId}</h4>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pay.bookingDate}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                    <span className="text-[10px] font-black text-primary uppercase">Vendor: {pay.assignedVendorId || 'Not Assigned'}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{pay.paymentMethod}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 w-full sm:w-auto">
                            <div className="text-right">
                                <p className="text-2xl font-black text-secondary tracking-tighter">₹{Number(pay.totalPrice).toLocaleString('en-IN')}</p>
                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                    {(pay.settlementStatus || 'PENDING') === 'SETTLED' ? (
                                        <>
                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Settled to Wallet</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={12} className="text-amber-500" />
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending Settlement</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No matching records</h3>
                        <p className="text-sm text-slate-300 font-medium mt-1">Try adjusting your filters or search term</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentsTab;
