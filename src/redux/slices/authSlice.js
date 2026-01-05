import { createSlice } from '@reduxjs/toolkit';
import { loginAdmin, registerAdmin } from '../thunks/authThunk';

const initialState = {
    adminDetails: JSON.parse(localStorage.getItem('adminDetails')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    success: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('adminDetails');
            state.adminDetails = null;
            state.token = null;
            state.error = null;
            state.success = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.adminDetails = action.payload.user;
                state.success = true;

                // Side effects (keeping here for sync, though better in middleware usually, but this is standard for simple apps)
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('adminDetails', JSON.stringify(action.payload.user));
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Register
            .addCase(registerAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerAdmin.fulfilled, (state) => {
                state.loading = false;
                state.success = true; // Registration successful
            })
            .addCase(registerAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
