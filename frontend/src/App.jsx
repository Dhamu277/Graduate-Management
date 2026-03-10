import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

import Community from './pages/Community';
import AdminPanel from './pages/AdminPanel';
import AIChatbot from './components/AIChatbot';
import Profile from './pages/Profile';
import Directory from './pages/Directory';
import Mentorships from './pages/Mentorships';
import Jobs from './pages/Jobs';
import Events from './pages/Events';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;
  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RoleBasedRedirect />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/directory" element={
            <ProtectedRoute>
              <Directory />
            </ProtectedRoute>
          } />

          <Route path="/mentorships" element={
            <ProtectedRoute>
              <Mentorships />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />

          <Route path="/admin/announcements" element={
            <ProtectedRoute allowedRoles={['Management']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['Management']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          
        </Routes>
        <AIChatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;
