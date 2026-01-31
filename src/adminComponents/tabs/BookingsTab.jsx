import React from 'react';
import { Clock } from 'lucide-react';

const BookingsTab = ({ recentBookings, setSelectedBooking }) => {
    console.log("Recent Bookings Data:", recentBookings);
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">All Service Requests</h2>
            <div className="grid grid-cols-1 gap-4">
                {recentBookings.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0"><Clock size={24} /></div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-sm">{job.packageName}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.customBookingId} • {job.bookingDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${job.bookingStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                job.bookingStatus === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                    'bg-orange-50 text-orange-600'
                                }`}>{job.bookingStatus}</span>
                            <p className="font-black text-slate-900">
                                {Number(job.totalPrice || job.priceAmount || 0).toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    minimumFractionDigits: 0
                                })}
                            </p>
                            <button
                                onClick={() => setSelectedBooking(job)}
                                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingsTab;
