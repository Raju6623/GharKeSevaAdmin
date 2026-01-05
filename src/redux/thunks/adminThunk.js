import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAdminData = createAsyncThunk(
  'admin/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const API_URL = "http://localhost:3001/api/auth";
      const statsRes = await axios.get(`${API_URL}/admin/stats`);
      const vendorsRes = await axios.get(`${API_URL}/admin/vendors`);
      
      return {
        adminData: statsRes.data.data,
        vendors: vendorsRes.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
