import React from 'react';

const AdminStatCard = ({ label, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${colorClass} rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                +12%
            </span>
        </div>
        <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-secondary tracking-tight">{value}</h3>
        </div>
    </div>
);

export default AdminStatCard;
