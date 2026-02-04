import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Tag, ClipboardList, Users, Wallet, X as CloseIcon, Ticket, Percent, Trophy, LayoutGrid } from 'lucide-react';

const SidebarItem = ({ name, icon, label, activeTab, setActiveTab, setIsSidebarOpen }) => (
    <button
        onClick={() => {
            setActiveTab(name);
            if (setIsSidebarOpen) setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === name ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'}`}
    >
        {icon} <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    </button>
);

const AdminSidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { name: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'SERVICES', label: 'Services', icon: <Tag size={20} /> },
        { name: 'BOOKINGS', label: 'Bookings', icon: <ClipboardList size={20} /> },
        { name: 'TECHNICIANS', label: 'Technicians', icon: <Users size={20} /> },
        { name: 'PAYMENTS', label: 'Payments', icon: <Wallet size={20} /> },
        { name: 'COUPONS', label: 'Public Coupons', icon: <Ticket size={20} /> },
        { name: 'VENDOR_OFFERS', label: 'Vendor Offers', icon: <Percent size={20} /> },
        { name: 'INCENTIVES', label: 'Milestones/Rewards', icon: <Trophy size={20} /> },
        { name: 'BANNERS', label: 'Site Banners', icon: <Tag size={20} /> },
        { name: 'ADDONS', label: 'Service Addons', icon: <ClipboardList size={20} /> },
        { name: 'CATEGORIES', label: 'Home Categories', icon: <LayoutGrid size={20} /> },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="p-2 bg-slate-900 rounded-xl"><ClipboardList className="text-white" size={24} /></div>
                    <span className="text-xl font-black tracking-tighter uppercase italic text-slate-900">GharKe<span className="text-blue-600">Seva</span></span>
                </div>
                <nav className="flex-1 space-y-4">
                    {navItems.map((item) => (
                        <SidebarItem key={item.name} {...item} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                </nav>
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] p-8 lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 rounded-xl"><ClipboardList className="text-white" size={20} /></div>
                                    <span className="text-lg font-black tracking-tighter uppercase italic text-slate-900">GharKe<span className="text-blue-600">Seva</span></span>
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-900"><CloseIcon size={24} /></button>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {navItems.map((item) => (
                                    <SidebarItem
                                        key={item.name}
                                        {...item}
                                        icon={React.cloneElement(item.icon, { size: 18 })}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        setIsSidebarOpen={setIsSidebarOpen}
                                    />
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
