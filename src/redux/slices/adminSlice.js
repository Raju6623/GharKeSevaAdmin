import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchAdminData, updateAdminService,
    fetchAdminBanners, addAdminBanner, deleteAdminBanner,
    fetchAdminAddons, addAdminAddon, deleteAdminAddon
} from '../thunks/adminThunk';
import axios from 'axios';

// Async Thunk to Fetch All Services (Admin View)
export const fetchAdminServices = createAsyncThunk('admin/fetchServices', async (category = 'All Services', { rejectWithValue }) => {
    try {
        const url = category === 'All Services'
            ? 'http://localhost:3001/api/auth/services'
            : `http://localhost:3001/api/auth/services?category=${encodeURIComponent(category)}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
});

// Async Thunk to Delete Service
export const deleteAdminService = createAsyncThunk('admin/deleteService', async (payload, { rejectWithValue }) => {
    try {
        const serviceId = typeof payload === 'object' ? payload.id : payload;
        const category = typeof payload === 'object' ? payload.category : '';

        // Pass category if available for backend optimization
        const url = category
            ? `http://localhost:3001/api/auth/admin/services/${serviceId}?category=${encodeURIComponent(category)}`
            : `http://localhost:3001/api/auth/admin/services/${serviceId}`;

        await axios.delete(url);
        return serviceId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
});

const initialState = {
    adminData: null,
    vendors: [],
    recentBookings: [],
    recentBookings: [],
    services: [],
    banners: [],
    addons: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        updateVendorStatus: (state, action) => {
            const { vendorId, status } = action.payload;
            if (state.vendors.length > 0) {
                state.vendors = state.vendors.map((v) =>
                    v.customUserId === vendorId ? { ...v, isOnline: status } : v
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminData.fulfilled, (state, action) => {
                state.loading = false;
                state.adminData = action.payload.adminData;
                state.vendors = action.payload.vendors;
                state.recentBookings = action.payload.adminData.recentBookingsList;
            })
            .addCase(fetchAdminData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handlers for fetchAdminServices
            .addCase(fetchAdminServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchAdminServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handlers for deleteAdminService
            .addCase(deleteAdminService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdminService.fulfilled, (state, action) => {
                state.loading = false;
                state.services = state.services.filter(s => s._id !== action.payload);
            })
            .addCase(deleteAdminService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handlers for updateAdminService
            .addCase(updateAdminService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdminService.fulfilled, (state, action) => {
                state.loading = false;
                // Update the service in the list
                const idx = state.services.findIndex(s => s._id === action.payload.data._id);
                if (idx !== -1) {
                    state.services[idx] = action.payload.data;
                }
            })
            .addCase(updateAdminService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // --- BANNERS ---
            .addCase(fetchAdminBanners.fulfilled, (state, action) => {
                state.banners = action.payload;
            })
            .addCase(addAdminBanner.fulfilled, (state, action) => {
                if (action.payload && action.payload.success) {
                    state.banners.unshift(action.payload);
                } else if (!action.payload.success && action.payload) {
                    state.banners.unshift(action.payload);
                }
            })
            .addCase(deleteAdminBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter(b => b._id !== action.payload);
            })
            // --- ADDONS ---
            .addCase(fetchAdminAddons.fulfilled, (state, action) => {
                state.addons = action.payload;
            })
            .addCase(addAdminAddon.fulfilled, (state, action) => {
                state.addons.unshift(action.payload);
            })
            .addCase(deleteAdminAddon.fulfilled, (state, action) => {
                state.addons = state.addons.filter(a => a._id !== action.payload);
            });
    },
});

export const { updateVendorStatus } = adminSlice.actions;
export default adminSlice.reducer;
