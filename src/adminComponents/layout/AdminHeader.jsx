import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';

const AdminHeader = ({ activeTab, setIsSidebarOpen }) => {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                    system {activeTab.toLowerCase()}
                </h1>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                >
                    <Menu size={24} />
                </button>
            </div>
            <Link
                to="/add-service"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 active:scale-95 transition-all w-full md:w-auto"
            >
                <Plus size={16} strokeWidth={4} /> Add Service
            </Link>
        </header>
    );
};

export default AdminHeader;
