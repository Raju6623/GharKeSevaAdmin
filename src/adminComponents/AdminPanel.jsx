import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../api/axiosConfig';

// Layout & Navigation
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';

// Tab Contents
import DashboardTab from './tabs/DashboardTab';
import TechniciansTab from './tabs/TechniciansTab';
import BookingsTab from './tabs/BookingsTab';
import PaymentsTab from './tabs/PaymentsTab';
import ServicesTab from './tabs/ServicesTab';
import AdminCoupons from './AdminCoupons'; // Correct Import
import VendorOffersTab from './tabs/VendorOffersTab';
import AdminIncentives from './AdminIncentives';
import BannerManager from './tabs/BannerManager'; // New
import AddonManager from './tabs/AddonManager'; // New
import CategoryManager from './tabs/CategoryManager';

// Modals
import VendorDetailsModal from './modals/VendorDetailsModal';
import BookingDetailsModal from './modals/BookingDetailsModal';

// Redux Actions
import { fetchAdminData, verifyVendor, updateAdminService, fetchAdminBanners, fetchAdminAddons, deleteAdminBanner, deleteAdminAddon, fetchAdminCategories } from '../redux/thunks/adminThunk';
import { updateVendorStatus, fetchAdminServices, deleteAdminService } from '../redux/slices/adminSlice';

// Icons for Stats
import { Wallet, ClipboardList, UserCheck, TrendingUp } from 'lucide-react';
import { BASE_URL } from '../config';

const socket = io(BASE_URL);

function AdminPanel() {
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState('All Services');

    const dispatch = useDispatch();
    const { adminData, vendors, recentBookings, services, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAdminData());
        // Initial fetch handled by selectedServiceCategory effect now
    }, [dispatch]);

    useEffect(() => {
        if (activeTab === 'SERVICES') {
            dispatch(fetchAdminServices(selectedServiceCategory));
        }
        if (activeTab === 'BANNERS') {
            dispatch(fetchAdminBanners());
        }
        if (activeTab === 'ADDONS') {
            dispatch(fetchAdminAddons());
        }
        if (activeTab === 'CATEGORIES') {
            dispatch(fetchAdminCategories());
        }
    }, [dispatch, activeTab, selectedServiceCategory]);

    useEffect(() => {
        socket.on('vendor_status_change', (data) => {
            dispatch(updateVendorStatus({ vendorId: data.vendorId, status: data.status }));
        });

        socket.on('admin_booking_update', () => {
            dispatch(fetchAdminData());
        });

        socket.on('service_update', (data) => {
            console.log("🔄 Real-time Service Update:", data);
            dispatch(fetchAdminServices(selectedServiceCategory));
        });

        socket.on('banner_update', () => {
            dispatch(fetchAdminBanners());
        });

        socket.on('addon_update', () => {
            dispatch(fetchAdminAddons());
        });

        return () => {
            socket.off('vendor_status_change');
            socket.off('admin_booking_update');
            socket.off('service_update');
            socket.off('banner_update');
            socket.off('addon_update');
        };
    }, [dispatch]);

    // Sync selected booking if it updates in the background
    useEffect(() => {
        if (selectedBooking && recentBookings) {
            const updated = recentBookings.find(b => b.customBookingId === selectedBooking.customBookingId);
            if (updated && (updated.bookingStatus !== selectedBooking.bookingStatus || updated.completionTime !== selectedBooking.completionTime)) {
                setSelectedBooking(updated);
            }
        }
    }, [recentBookings, selectedBooking]);

    const handleVerifyVendorAction = async (vendor, note, isApproved) => {
        const payload = { vendorId: vendor.customUserId, verificationMessage: note, isVerified: isApproved };
        const response = await dispatch(verifyVendor(payload));
        if (!response.error) {
            alert(isApproved ? "Vendor Verified Successfully!" : "Vendor Status Updated!");
            setSelectedVendor(null);
        } else {
            alert("Action Failed: " + response.payload);
        }
    };

    const onlineVendors = vendors.filter(v => v.isOnline === true);
    const notifications = {
        newVendors: vendors.filter(v => !v.isVerified).length,
        newBookings: recentBookings.filter(b => b.bookingStatus === 'Pending').length
    };

    const systemStats = [
        { label: 'Total Revenue', value: adminData?.totalRevenue || '0', icon: <Wallet className="text-primary" />, color: 'bg-primary/5' },
        { label: 'Total Bookings', value: adminData?.activeBookingsCount?.toString() || '0', icon: <ClipboardList className="text-blue-500" />, color: 'bg-blue-50' },
        { label: 'Online Techs', value: onlineVendors.length.toString(), icon: <UserCheck className="text-indigo-500" />, color: 'bg-indigo-50' },
        { label: 'Satisfaction', value: '4.8/5', icon: <TrendingUp className="text-orange-500" />, color: 'bg-orange-50' },
    ];

    const handleDeleteVendorAction = async (vendorId) => {
        if (!window.confirm("CRITICAL: Are you sure you want to PERMANENTLY DELETE this vendor? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/vendor/${vendorId}`);
            alert("Vendor Deleted Successfully");
            setSelectedVendor(null);
            dispatch(fetchAdminData());
        } catch (err) {
            alert("Delete Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleBlockVendorAction = async (vendorId, reason) => {
        try {
            await api.put(`/admin/vendor/block/${vendorId}`, { reason });
            alert("Vendor Blocked Successfully");
            setSelectedVendor(null);
            dispatch(fetchAdminData());
        } catch (err) {
            alert("Block Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleUnblockVendorAction = async (vendorId) => {
        try {
            await api.put(`/admin/vendor/unblock/${vendorId}`);
            alert("Vendor Unblocked Successfully");
            setSelectedVendor(null);
            dispatch(fetchAdminData());
        } catch (err) {
            alert("Unblock Failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                notifications={notifications}
            />

            <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto relative min-w-0">
                <AdminHeader
                    activeTab={activeTab}
                    setIsSidebarOpen={setIsSidebarOpen}
                    vendors={vendors}
                    recentBookings={recentBookings}
                    onSelectVendor={(v) => {
                        setActiveTab(v.isVerified ? 'TECHNICIANS' : 'NEW_VENDORS');
                        setSelectedVendor(v);
                    }}
                    onSelectBooking={(b) => {
                        setActiveTab('BOOKINGS');
                        setSelectedBooking(b);
                    }}
                />

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-medium tracking-wide">Synchronizing System...</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'DASHBOARD' && <DashboardTab stats={systemStats} />}
                        {activeTab === 'NEW_VENDORS' && (
                            <TechniciansTab
                                vendors={vendors.filter(v => !v.isVerified)}
                                setSelectedVendor={setSelectedVendor}
                                title="New Approvals"
                                subTitle="Pending verification requests from new service partners."
                            />
                        )}
                        {activeTab === 'TECHNICIANS' && (
                            <TechniciansTab
                                vendors={vendors.filter(v => v.isVerified)}
                                setSelectedVendor={setSelectedVendor}
                                title="Registered Partners"
                                subTitle="Listing of all verified and active service professionals."
                            />
                        )}
                        {activeTab === 'BOOKINGS' && <BookingsTab recentBookings={recentBookings} setSelectedBooking={setSelectedBooking} />}
                        {activeTab === 'PAYMENTS' && <PaymentsTab recentBookings={recentBookings} />}
                        {activeTab === 'SERVICES' && (
                            <ServicesTab
                                services={services}
                                selectedCategory={selectedServiceCategory}
                                onCategoryChange={setSelectedServiceCategory}
                                onDeleteService={(payload) => dispatch(deleteAdminService(payload))}
                                onUpdateService={(id, data, cat) => dispatch(updateAdminService({ serviceId: id, formData: data, category: cat }))}
                            />
                        )}
                        {activeTab === 'COUPONS' && <AdminCoupons />}
                        {activeTab === 'VENDOR_OFFERS' && <VendorOffersTab />}
                        {activeTab === 'INCENTIVES' && <AdminIncentives />}
                        {activeTab === 'BANNERS' && <BannerManager />}
                        {activeTab === 'ADDONS' && <AddonManager />}
                        {activeTab === 'CATEGORIES' && <CategoryManager />}
                    </div>
                )}

                {selectedVendor && (
                    <VendorDetailsModal
                        vendor={selectedVendor}
                        onClose={() => setSelectedVendor(null)}
                        onVerify={handleVerifyVendorAction}
                        onDelete={handleDeleteVendorAction}
                        onBlock={handleBlockVendorAction}
                        onUnblock={handleUnblockVendorAction}
                    />
                )}

                {selectedBooking && (
                    <BookingDetailsModal
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
