import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchAdminData = createAsyncThunk(
  'admin/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const statsRes = await api.get('/admin/stats');
      const vendorsRes = await api.get('/admin/vendors');

      return {
        adminData: statsRes.data,
        vendors: vendorsRes.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk to Update Service
export const updateAdminService = createAsyncThunk(
  'admin/updateService',
  async ({ serviceId, formData, category }, { rejectWithValue }) => {
    try {
      const url = `/admin/services/${serviceId}?category=${encodeURIComponent(category || 'All Services')}`;
      const response = await api.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

export const verifyVendor = createAsyncThunk(
  'admin/verifyVendor',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { vendorId, ...updateData } = payload;
      // If payload is just an ID string (legacy support), treat it as verification only
      const id = typeof payload === 'string' ? payload : vendorId;
      const data = typeof payload === 'string' ? { isVerified: true } : updateData;

      await api.put(`/admin/update-vendor/${id}`, data);
      dispatch(fetchAdminData()); // Refresh data after verification
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification Failed');
    }
  }
);

// --- BANNERS ---
export const fetchAdminBanners = createAsyncThunk('admin/fetchBanners', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/banners');
    return response.data; // Expecting array
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
  }
});

export const addAdminBanner = createAsyncThunk('admin/addBanner', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/banners/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add banner');
  }
});

export const updateAdminBanner = createAsyncThunk('admin/updateBanner', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update banner');
  }
});

export const deleteAdminBanner = createAsyncThunk('admin/deleteBanner', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/banners/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete banner');
  }
});

// --- ADDONS ---
export const fetchAdminAddons = createAsyncThunk('admin/fetchAddons', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/addons');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch addons');
  }
});

export const addAdminAddon = createAsyncThunk('admin/addAddon', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/addons/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add addon');
  }
});

export const updateAdminAddon = createAsyncThunk('admin/updateAddon', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/addons/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update addon');
  }
});

export const deleteAdminAddon = createAsyncThunk('admin/deleteAddon', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/addons/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete addon');
  }
});
