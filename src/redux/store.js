import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        auth: authReducer,
    },
});
