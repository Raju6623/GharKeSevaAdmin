import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminAddService from './adminPannel/AdminAddService';
import AdminPanel from './adminPannel/AdminPanel';
import AdminLogin from './adminAuth/AdminLogin';
import AdminRegister from './adminAuth/AdminRegister';
import ProtectedRoute from './adminAuth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-service"
          element={
            <ProtectedRoute>
              <AdminAddService />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;