import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, Search, Bell, User } from 'lucide-react';

const AdminHeader = ({ activeTab, setIsSidebarOpen }) => {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-12">
            <div className="flex items-center justify-between flex-1">
                <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight">
                        {activeTab.charAt(0) + activeTab.slice(1).toLowerCase().replace('_', ' ')}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage your system operations and status</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Activity & Notifications */}
                    <div className="hidden md:flex items-center gap-2 mr-4">
                        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                            <Search size={20} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/add-service"
                    className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all w-full md:w-auto"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Add New Service</span>
                </Link>

                <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-bold text-secondary">Admin User</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">System Root</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
