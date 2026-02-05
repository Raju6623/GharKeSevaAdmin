import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute  ({ children }) {
    const token = localStorage.getItem('token');
    const adminDetails = localStorage.getItem('adminDetails');

    if (!token || !adminDetails) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
