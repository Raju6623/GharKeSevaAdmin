import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminAddService from './adminPannel/AdminAddService';
import AdminPanel from './adminPannel/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/admin" element={<AdminPanel />} />
        
       
        <Route path="/add-service" element={<AdminAddService />} />
        
        
        <Route path="/" element={<Navigate to="/admin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;