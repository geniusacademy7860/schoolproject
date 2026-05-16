import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthcontext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import HomePage from './pages/HomePage';
import CoachingPage from './pages/CoachingPage';
import AdmissionForm from './pages/AdmissionForm';
import AdminLoginPage from './pages/AdminLoginPage';
import StudentPortal from './pages/StudentPortal';

import StudentDashboard from './pages/StudentDashboard';
import AttendancePage from './pages/AttendancePage';
import ResultPage from './pages/ResultPage';
import ProfilePage from './pages/ProfilePage';
import FeePage from './pages/FeePage';

import AdminDashboard from './pages/AdminDashboard';
import StudentsManagement from './pages/StudentsManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import ResultsManagement from './pages/ResultsManagement';
import NoticesManagement from './pages/NoticesManagement';
import AdmissionsManagement from './pages/AdmissionsManagement';
import FeeManagement from './pages/FeeManagement';
import GalleryManagement from './pages/GalleryManagement';
import EventsManagement from './pages/EventsManagement';
import SettingPage from './pages/SettingPage';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>

            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/coaching" element={<CoachingPage />} />
            <Route path="/admission" element={<AdmissionForm />} />
            <Route path="/student-login" element={<StudentPortal />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />

            {/* ===== STUDENT ROUTES — ProtectedRoute (student auth) ===== */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute><AttendancePage /></ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute><ResultPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/fees" element={
              <ProtectedRoute><FeePage /></ProtectedRoute>
            } />

            {/* ===== ADMIN ROUTES — AdminProtectedRoute (admin auth) ===== */}
            <Route path="/admin-dashboard" element={
              <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <AdminProtectedRoute><StudentsManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/attendance" element={
              <AdminProtectedRoute><AttendanceManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/results" element={
              <AdminProtectedRoute><ResultsManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/notices" element={
              <AdminProtectedRoute><NoticesManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/admissions" element={
              <AdminProtectedRoute><AdmissionsManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/fees" element={
              <AdminProtectedRoute><FeeManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <AdminProtectedRoute><GalleryManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <AdminProtectedRoute><EventsManagement /></AdminProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminProtectedRoute><SettingPage /></AdminProtectedRoute>
            } />

            {/* ===== 404 ===== */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-4" style={{ color: '#1A3C8F' }}>404</h1>
                  <p className="text-xl text-muted-foreground mb-6">Page not found</p>
                  <a href="/" className="text-primary hover:underline">Back to home</a>
                </div>
              </div>
            } />

          </Routes>
          <Toaster />
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;