import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OTPPage } from './pages/OTPPage';
import { DashboardPage } from './pages/DashboardPage';
import { MainLayout } from './layouts/MainLayout';
import { motion, AnimatePresence } from 'motion/react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OTPPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout onLogout={handleLogout}>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
