import React from 'react';
import { IndianRupee } from 'lucide-react';

const PaymentsTab = ({ recentBookings }) => {
    const completedBookings = recentBookings.filter(b => b.bookingStatus === 'Completed');

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Settlements</h2>
            {completedBookings.map((pay) => (
                <div key={pay._id} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-slate-50">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <IndianRupee size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 uppercase text-sm md:text-base">Order {pay.customBookingId}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pay.bookingDate}</p>
                        </div>
                    </div>
                    <p className="text-lg md:text-xl font-black text-slate-900">₹{pay.totalPrice}</p>
                </div>
            ))}
            {completedBookings.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <IndianRupee size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No settlements found</p>
                </div>
            )}
        </div>
    );
};

export default PaymentsTab;
