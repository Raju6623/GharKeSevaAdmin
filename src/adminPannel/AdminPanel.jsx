import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  LayoutDashboard, Users, ClipboardList, Wallet, Settings,
  TrendingUp, UserCheck, Plus, MapPin, Phone, IndianRupee, Clock, CheckCircle2
} from 'lucide-react';
import { fetchAdminData } from '../redux/thunks/adminThunk';
import { updateVendorStatus } from '../redux/slices/adminSlice';

const socket = io('http://localhost:3001');

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const dispatch = useDispatch();
  const { adminData, vendors, recentBookings, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminData());

    // --- REAL-TIME FIX: AUTO REMOVE LOGIC ---
    socket.on('vendor_status_change', (data) => {
      dispatch(updateVendorStatus({ vendorId: data.vendorId, status: data.status }));
    });

    return () => socket.off('vendor_status_change');
  }, [dispatch]);

  // Derive data for stats
  const onlineOnly = vendors.filter(v => v.isOnline === true);

  const stats = [
    { label: 'Total Revenue', value: adminData?.totalRevenue || '0', icon: <Wallet className="text-emerald-600" />, color: 'bg-emerald-50' },
    { label: 'Total Bookings', value: adminData?.activeBookingsCount?.toString() || '0', icon: <ClipboardList className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Online Techs', value: onlineOnly.length.toString(), icon: <UserCheck className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Satisfaction', value: '4.8/5', icon: <TrendingUp className="text-orange-600" />, color: 'bg-orange-50' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:translate-y-[-5px] transition-all duration-300">
                  <div className={`p-4 ${stat.color} rounded-2xl w-fit mb-6`}>{stat.icon}</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                </div>
              ))}
            </section>
            {/* Recent Operations Table Code Same Rahega */}
          </>
        );

      case 'TECHNICIANS':
        // FIX: Yeh line vendor ko list se hatayegi agar status false hai
        const onlineOnlyList = vendors.filter(v => v.isOnline === true);

        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Live Squad</h2>
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Active Now: {onlineOnlyList.length}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {onlineOnlyList.length > 0 ? onlineOnlyList.map((vendor) => (
                <div key={vendor._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl relative group">
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-emerald-500">Online</span>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse border-2 border-white"></div>
                  </div>
                  {/* Vendor Details Same Rahengi */}
                  <div className="flex items-center gap-4 mb-6">
                    <img src={vendor.vendorPhoto || 'https://via.placeholder.com/150'} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 shadow-sm" />
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{vendor.userFullName}</h4>
                      <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">{vendor.vendorCategory}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6 text-slate-500 text-xs font-bold uppercase">
                    <div className="flex items-center gap-2"><Phone size={14} /> {vendor.userPhone}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} /> ID: {vendor.customUserId}</div>
                  </div>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-lg">Monitor Partner</button>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <UserCheck size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No technicians are currently online</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'BOOKINGS':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">All Service Requests</h2>
            <div className="grid grid-cols-1 gap-4">
              {recentBookings.map((job) => (
                <div key={job._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Clock size={24} /></div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase text-sm">{job.packageName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.customBookingId} • {job.bookingDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">{job.bookingStatus}</span>
                    <p className="font-black text-slate-900">₹{job.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'PAYMENTS':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Settlements</h2>
            {recentBookings.filter(b => b.bookingStatus === 'Completed').map((pay) => (
              <div key={pay._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><IndianRupee size={28} /></div>
                  <div><h4 className="font-black text-slate-900 uppercase">Order {pay.customBookingId}</h4></div>
                </div>
                <p className="text-xl font-black text-slate-900">₹{pay.totalPrice}</p>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="p-20 text-center font-black text-slate-300 text-2xl uppercase tracking-widest">{activeTab} Section</div>;
    }
  };

  const SidebarItem = ({ name, icon, label }) => (
    <button onClick={() => setActiveTab(name)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === name ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'}`}>
      {icon} <span className="text-sm font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-slate-900 rounded-xl"><ClipboardList className="text-white" size={24} /></div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-slate-900">GharKe<span className="text-blue-600">Seva</span></span>
        </div>
        <nav className="flex-1 space-y-4">
          <SidebarItem name="DASHBOARD" label="Dashboard" icon={<LayoutDashboard size={20} />} />
          <SidebarItem name="BOOKINGS" label="Bookings" icon={<ClipboardList size={20} />} />
          <SidebarItem name="TECHNICIANS" label="Technicians" icon={<Users size={20} />} />
          <SidebarItem name="PAYMENTS" label="Payments" icon={<Wallet size={20} />} />
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">system {activeTab}</h1>
          <Link to="/add-service" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
            <Plus size={16} strokeWidth={4} /> Add Service
          </Link>
        </header>
        {loading ? <div className="flex flex-col items-center justify-center h-96 animate-spin">Synchronizing...</div> : renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;