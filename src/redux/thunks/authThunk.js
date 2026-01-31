import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Authentication failed");
        }
    }
);

export const registerAdmin = createAsyncThunk(
    'auth/registerAdmin',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);
