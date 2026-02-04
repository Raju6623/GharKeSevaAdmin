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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-12 relative z-[100]">
            <div className="flex items-center justify-between flex-1">
                <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight">
                        {activeTab.charAt(0) + activeTab.slice(1).toLowerCase().replace('_', ' ')}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Manage your system operations and status</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search & Notifications */}
                    <div className="flex items-center gap-2 mr-4">
                        {/* Global Search */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`p-2.5 rounded-xl transition-all ${isSearchOpen ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
                            >
                                <Search size={20} />
                            </button>

                            {isSearchOpen && (
                                <div className="absolute top-14 right-0 md:right-auto md:left-0 w-[300px] md:w-[400px] bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="relative mb-4">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search vendors, booking ID, services..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        {searchQuery && (
                                            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {searchQuery.length > 0 && searchQuery.length < 3 && (
                                            <p className="text-[10px] text-center text-slate-400 py-2">Type at least 3 characters...</p>
                                        )}
                                        {searchQuery.length >= 3 && searchResults.length === 0 && (
                                            <p className="text-[10px] text-center text-slate-400 py-2">No matching results found</p>
                                        )}
                                        {searchResults.map((res, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleResultClick(res)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-primary/10 group-hover:text-primary">
                                                        {res.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-bold text-slate-700">{res.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">#{res.id} • {res.type}</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`p-2.5 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
                            >
                                <Bell size={20} />
                                {notificationItems.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute top-14 right-0 w-[320px] bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                        <h4 className="text-sm font-bold text-secondary">System Alerts</h4>
                                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{notificationItems.length} New</span>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto py-2">
                                        {notificationItems.length === 0 ? (
                                            <div className="p-10 text-center">
                                                <CheckCircle2 size={32} className="mx-auto text-slate-200 mb-2" />
                                                <p className="text-[11px] font-bold text-slate-400">Everything up to date</p>
                                            </div>
                                        ) : (
                                            notificationItems.map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleNotificationClick(item)}
                                                    className="w-full p-4 flex gap-3 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0"
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'vendor' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                                                        {item.type === 'vendor' ? <User size={16} /> : <Calendar size={16} />}
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">{item.desc}</p>
                                                        <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-wider">{item.time}</p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    {notificationItems.length > 0 && (
                                        <button className="w-full py-3 text-[10px] font-bold text-primary hover:bg-primary/5 transition-all uppercase tracking-widest border-t border-slate-50">
                                            View All Activity
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
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
