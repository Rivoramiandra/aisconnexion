import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardRoutes from './components/Dashboard/DashboardRoutes'; // CHANGÉ
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Toutes les routes du dashboard commençant par /dashboard */}
      <Route path="/dashboard/*" element={
        <PrivateRoute>
          <DashboardRoutes />
        </PrivateRoute>
      } />
      
      {/* Redirection vers le dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Route 404 globale */}
      <Route path="*" element={<div>Page non trouvée</div>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;