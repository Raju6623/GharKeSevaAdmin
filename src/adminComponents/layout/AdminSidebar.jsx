import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    LayoutDashboard, Tag, ClipboardList, Users, Wallet,
    X as CloseIcon, Ticket, Percent, Trophy, LayoutGrid,
    LogOut, Settings, Bell, UserCheck
} from 'lucide-react';

const SidebarItem = ({ name, icon, label, activeTab, setActiveTab, setIsSidebarOpen, count }) => {
    const isActive = activeTab === name;

    return (
        <button
            onClick={() => {
                setActiveTab(name);
                if (setIsSidebarOpen) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
                ${isActive
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
        >
            {isActive && (
                <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            <span className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                {React.cloneElement(icon, { size: 20 })}
            </span>
            <span className="text-sm tracking-wide flex-1 text-left">{label}</span>

            {count > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center shadow-lg shadow-primary/20 animate-bounce-subtle">
                    {count}
                </span>
            )}
        </button>
    );
};

const AdminSidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, notifications = {} }) => {
    const navItems = [
        { name: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard /> },
        { name: 'NEW_VENDORS', label: 'New Approvals', icon: <UserCheck />, count: notifications.newVendors },
        { name: 'TECHNICIANS', label: 'Registered Partners', icon: <Users /> },
        { name: 'SERVICES', label: 'Services', icon: <Tag /> },
        { name: 'BOOKINGS', label: 'Bookings', icon: <ClipboardList />, count: notifications.newBookings },
        { name: 'PAYMENTS', label: 'Payments', icon: <Wallet /> },
        { name: 'COUPONS', label: 'Public Coupons', icon: <Ticket /> },
        { name: 'VENDOR_OFFERS', label: 'Vendor Offers', icon: <Percent /> },
        { name: 'INCENTIVES', label: 'Milestones/Rewards', icon: <Trophy /> },
        { name: 'BANNERS', label: 'Site Banners', icon: <Tag /> },
        { name: 'ADDONS', label: 'Service Addons', icon: <ClipboardList /> },
        { name: 'CATEGORIES', label: 'Home Categories', icon: <LayoutGrid /> },
    ];

    const sidebarContent = (isMobile = false) => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`flex items-center gap-3 mb-10 px-2 ${isMobile ? 'justify-between' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                        <ClipboardList className="text-white" size={22} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-secondary">
                        GharKe<span className="text-primary">Seva</span>
                    </span>
                </div>
                {isMobile && (
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">
                        <CloseIcon size={24} />
                    </button>
                )}
            </div>

            {/* Nav Items */}
            <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar py-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4 font-outfit">Menu</p>
                {navItems.map((item) => (
                    <SidebarItem
                        key={item.name}
                        {...item}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsSidebarOpen={isMobile ? setIsSidebarOpen : null}
                    />
                ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group">
                    <LogOut size={20} className="group-hover:text-red-500" />
                    <span className="text-sm font-medium">Logout System</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 p-6 hidden lg:flex flex-col sticky top-0 h-screen">
                {sidebarContent(false)}
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
                            className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[70] p-6 lg:hidden shadow-2xl flex flex-col"
                        >
                            {sidebarContent(true)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
