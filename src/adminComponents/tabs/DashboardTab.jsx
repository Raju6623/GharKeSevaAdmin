import React from 'react';
import { Crown, Trophy, LayoutGrid } from 'lucide-react';
import AdminStatCard from '../shared/AdminStatCard';

const DashboardTab = ({ stats, onTabChange }) => {
    return (
        <div className="space-y-12">
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <AdminStatCard key={i} {...stat} colorClass={stat.color} />
                ))}
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-6 ml-1">Quick Setup & Growth</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        onClick={() => onTabChange('MEMBERSHIP')}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:scale-[1.02] transition-all cursor-pointer active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Crown size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg">Elite Membership</h4>
                        <p className="text-slate-500 text-xs mt-1 font-medium italic">Configure plans, prices & colors.</p>
                    </div>

                    <div
                        onClick={() => onTabChange('REWARDS')}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:scale-[1.02] transition-all cursor-pointer active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Trophy size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg">Refer & Earn</h4>
                        <p className="text-slate-500 text-xs mt-1 font-medium italic">Set coin rewards for referrals.</p>
                    </div>

                    <div
                        onClick={() => onTabChange('CATEGORIES')}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:scale-[1.02] transition-all cursor-pointer active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <LayoutGrid size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg">Home Categories</h4>
                        <p className="text-slate-500 text-xs mt-1 font-medium italic">Update icons & tags on home.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardTab;
