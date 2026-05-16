import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthcontext';
import {
  LayoutDashboard, Users, Calendar, Award, DollarSign,
  Bell, FileText, Image, Star, Settings, LogOut, Menu, X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentAdmin, logoutAdmin, isAdminAuthenticated } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ SECURITY FIX — Admin authenticated nahi hai to login page par bhejo
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAdminAuthenticated]);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
    { label: 'Students', icon: Users, path: '/admin/students' },
    { label: 'Attendance', icon: Calendar, path: '/admin/attendance' },
    { label: 'Results', icon: Award, path: '/admin/results' },
    { label: 'Fees', icon: DollarSign, path: '/admin/fees' },
    { label: 'Notices', icon: Bell, path: '/admin/notices' },
    { label: 'Admissions', icon: FileText, path: '/admin/admissions' },
    { label: 'Gallery', icon: Image, path: '/admin/gallery' },
    { label: 'Events', icon: Star, path: '/admin/events' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-sm">
            GA
          </div>
          <div>
            <div className="font-bold text-white text-sm">Genius Admin</div>
            <div className="text-white/60 text-xs">Forbesganj</div>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
            {currentAdmin?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {currentAdmin?.name || 'Admin'}
            </div>
            <div className="text-xs text-white/60 truncate">
              {currentAdmin?.email || ''}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white text-[#1A3C8F]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 z-50" style={{ backgroundColor: '#1A3C8F' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col" style={{ backgroundColor: '#1A3C8F' }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-slate-800">
                {menuItems.find(m => m.path === location.pathname)?.label || 'Admin Panel'}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Genius Academy Forbesganj
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;