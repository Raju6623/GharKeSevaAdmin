import React from 'react';
import { IndianRupee, CreditCard } from 'lucide-react';

const PaymentsTab = ({ recentBookings }) => {
    const completedBookings = recentBookings.filter(b => b.bookingStatus === 'Completed');

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-secondary tracking-tight">Financial Settlements</h2>
                <p className="text-xs text-slate-500 font-medium">Overview of completed order payments and revenues</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {completedBookings.map((pay) => (
                    <div key={pay._id} className="group bg-white p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                <IndianRupee size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-secondary text-base">Order {pay.customBookingId}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pay.bookingDate}</span>
                                    <span className="text-slate-200">|</span>
                                    <span className="text-[10px] font-bold text-primary uppercase">Revenue Released</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right w-full sm:w-auto">
                            <p className="text-xl font-bold text-secondary">₹{Number(pay.totalPrice).toLocaleString('en-IN')}</p>
                            <p className="text-[10px] font-medium text-emerald-500">Credited</p>
                        </div>
                    </div>
                ))}

                {completedBookings.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                        <CreditCard size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No settlements found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentsTab;
