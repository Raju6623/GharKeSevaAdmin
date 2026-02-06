import React, { useState } from 'react';
import { Clock, ExternalLink, Calendar, Hash, MoreVertical, Search, Filter } from 'lucide-react';

const BookingsTab = ({ recentBookings, setSelectedBooking }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filteredBookings = recentBookings.filter(job => {
        const matchesSearch =
            job.customBookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.packageName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || job.bookingStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const statusOptions = ['ALL', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary tracking-tight">Service Requests</h2>
                    <p className="text-xs text-slate-500 font-medium">Track and manage your live system bookings</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">{filteredBookings.length} Matching Jobs</span>
                    </div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Service..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                                ${filterStatus === status
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                                    : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">Service Info</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">Order ID</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">Date</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">Amount</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100 text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBookings.map((job) => (
                                <tr key={job._id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary text-sm">{job.packageName}</h4>
                                                <p className="text-[10px] font-medium text-slate-400">Standard Service</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-secondary/70">
                                            <Hash size={12} className="text-slate-300" />
                                            {job.customBookingId}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-secondary/70 text-slate-500">
                                            <Calendar size={12} className="text-slate-300" />
                                            {job.bookingDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-secondary text-sm">
                                            {Number(job.totalPrice || job.priceAmount || 0).toLocaleString('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                                minimumFractionDigits: 0
                                            })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider inline-block min-w-[90px] ${job.bookingStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            job.bookingStatus === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                            {job.bookingStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedBooking(job)}
                                                className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100 hover:bg-secondary hover:text-white hover:border-secondary transition-all flex items-center gap-2"
                                            >
                                                <span>Review</span>
                                                <ExternalLink size={12} />
                                            </button>
                                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {recentBookings.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Clock size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active bookings found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsTab;
