import React from 'react';

const AdminStatCard = ({ label, value, icon, colorClass }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:translate-y-[-5px] transition-all duration-300">
        <div className={`p-4 ${colorClass} rounded-2xl w-fit mb-6`}>{icon}</div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
);

export default AdminStatCard;
