import { createSlice } from '@reduxjs/toolkit';
import { fetchAdminData } from '../thunks/adminThunk';

const initialState = {
    adminData: null,
    vendors: [],
    recentBookings: [],
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
            });
    },
});

export const { updateVendorStatus } = adminSlice.actions;
export default adminSlice.reducer;
