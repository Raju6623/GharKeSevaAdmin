import React from 'react';
import { Trash2, ClipboardList, Users, Clock, Briefcase } from 'lucide-react';

const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative p-8">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <Trash2 size={20} className="text-slate-500" />
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ClipboardList size={24} /></div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-none">{booking.packageName}</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Order #{booking.customBookingId}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${booking.bookingStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>{booking.bookingStatus}</span>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {booking.serviceCategory}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Users size={14} /> Customer Details
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Name</span>
                                <span className="font-bold text-slate-700">{booking.customerName || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone</span>
                                <span className="font-bold text-slate-700">{booking.customerPhone || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                                <p className="font-medium text-slate-600 text-sm leading-snug">{booking.customerLocation || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock size={14} /> Booking Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                                <span className="font-bold text-slate-700">{booking.bookingDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Time</span>
                                <span className="font-bold text-slate-700">{booking.bookingStartTime}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</span>
                                <span className="font-black text-xl text-slate-900">₹{booking.totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Payment</span>
                                <span className="font-bold text-slate-700">{booking.paymentStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {booking.assignedVendorId ? (
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl mb-8">
                        <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Briefcase size={14} /> Assigned Partner
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Name</span>
                                <p className="font-bold text-slate-700">{booking.vendorDetails?.name || 'Loading...'}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">User ID</span>
                                <p className="font-bold text-slate-700">{booking.assignedVendorId}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone</span>
                                <p className="font-bold text-slate-700">{booking.vendorDetails?.phone || 'N/A'}</p>
                            </div>
                            {booking.completionTime && (
                                <div>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase block">Completed At</span>
                                    <p className="font-bold text-emerald-700">{booking.completionTime}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-8">
                        <p className="text-amber-700 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                            <Briefcase size={14} /> Not assigned yet
                        </p>
                    </div>
                )}

                <button onClick={onClose} className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-xl">
                    Close Details
                </button>
            </div>
        </div>
    );
};

export default BookingDetailsModal;
