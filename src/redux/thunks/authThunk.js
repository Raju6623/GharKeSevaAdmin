import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/admin/login', credentials);
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
            const response = await axios.post('http://localhost:3001/api/auth/admin/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);
