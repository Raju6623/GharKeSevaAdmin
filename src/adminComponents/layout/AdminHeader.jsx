import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, Search, Bell, User, X, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

const AdminHeader = ({ activeTab, setIsSidebarOpen, vendors = [], recentBookings = [], onSelectVendor, onSelectBooking }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const notificationRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResultClick = (res) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        if (res.type === 'Vendor' && onSelectVendor) {
            onSelectVendor(res.raw);
        } else if (res.type === 'Booking' && onSelectBooking) {
            onSelectBooking(res.raw);
        }
    };

    const handleNotificationClick = (item) => {
        setIsNotificationsOpen(false);
        if (item.type === 'vendor' && onSelectVendor) {
            onSelectVendor(item.raw);
        } else if (item.type === 'booking' && onSelectBooking) {
            onSelectBooking(item.raw);
        }
    };

    // Filtered search results
    const searchResults = searchQuery.length > 2 ? [
        ...vendors.filter(v =>
            v.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.customUserId?.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(v => ({ id: v.customUserId, title: v.vendorName, type: 'Vendor', icon: <User size={14} />, raw: v })),
        ...recentBookings.filter(b =>
            b.customBookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(b => ({ id: b.customBookingId, title: b.serviceTitle, type: 'Booking', icon: <Calendar size={14} />, raw: b }))
    ].slice(0, 5) : [];

    // Notification items (Recent 5 events)
    const notificationItems = [
        ...vendors.filter(v => !v.isVerified).map(v => ({
            id: v._id,
            title: 'New Vendor Registration',
            desc: `${v.vendorName} is waiting for approval.`,
            type: 'vendor',
            time: 'Just now',
            raw: v
        })),
        ...recentBookings.filter(b => b.bookingStatus === 'Pending').map(b => ({
            id: b._id,
            title: 'New Booking Received',
            desc: `Order for ${b.serviceTitle} is pending assignment.`,
            type: 'booking',
            time: 'Recently',
            raw: b
        }))
    ].slice(0, 5);

    return (
        <header className="flex flex-col gap-6 mb-8 lg:mb-12 relative z-20">
            {/* Top Row: Title & Action Icons */}
            <div className="flex items-center justify-between gap-4 w-full bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-slate-100 shadow-sm lg:bg-transparent lg:p-0 lg:border-0 lg:shadow-none lg:backdrop-blur-none transition-all duration-300">
                <div className="flex flex-col min-w-0">
                    <h1 className="text-xl md:text-3xl font-black text-secondary tracking-tight truncate">
                        {activeTab.charAt(0) + activeTab.slice(1).toLowerCase().replace('_', ' ')}
                    </h1>
                    <p className="hidden sm:block text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        System Operations
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Global Search */}
                    <div className="relative" ref={searchRef}>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`p-2.5 rounded-xl transition-all ${isSearchOpen ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
                        >
                            <Search size={20} />
                        </button>

                        {isSearchOpen && (
                            <div className="fixed sm:absolute top-20 sm:top-14 right-4 sm:right-0 w-[calc(100vw-2rem)] sm:w-[400px] bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300 z-[120]">
                                <div className="relative mb-4">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search system..."
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                                <div className="space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
                                    {searchResults.map((res, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleResultClick(res)}
                                            className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-primary/10 group-hover:text-primary">
                                                    {res.icon}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-slate-800">{res.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">#{res.id}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={`p-2.5 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
                        >
                            <Bell size={20} />
                            {notificationItems.length > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <div className="fixed sm:absolute top-20 sm:top-14 right-4 sm:right-0 w-[calc(100vw-2rem)] sm:w-[320px] bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[120]">
                                <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                                    <h4 className="text-xs font-black text-secondary tracking-widest uppercase">Quick Notifications</h4>
                                </div>
                                <div className="max-h-[350px] overflow-y-auto no-scrollbar py-2">
                                    {notificationItems.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleNotificationClick(item)}
                                            className="w-full p-4 flex gap-3 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0"
                                        >
                                            <div className="text-left flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5 truncate">{item.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-8 bg-slate-100 mx-2 lg:hidden" />

                    {/* Sidebar Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2.5 bg-secondary text-white rounded-xl shadow-lg shadow-secondary/20 active:scale-95 transition-all"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Bottom Row: Primary Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <Link
                    to="/add-service"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 text-center"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Add New Service</span>
                </Link>

                <div className="hidden md:flex items-center gap-4 pl-6 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-black text-secondary">System Root</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary border border-slate-100 shadow-sm">
                        <User size={22} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
