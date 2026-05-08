import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthcontext';
import {
  LayoutDashboard, Users, Calendar, Award,
  Bell, FileText, Settings, LogOut, Menu, X,
  DollarSign, Image, Star
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentAdmin, logoutAdmin } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: Calendar },
    { name: 'Results', path: '/admin/results', icon: Award },
    { name: 'Fees', path: '/admin/fees', icon: DollarSign },
    { name: 'Notices', path: '/admin/notices', icon: Bell },
    { name: 'Admissions', path: '/admin/admissions', icon: FileText },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Events', path: '/admin/events', icon: Star },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0D2459] text-white">
      <div className="p-6 flex items-center justify-center border-b border-white/10">
        <div className="text-xl font-bold tracking-wide">Genius Admin</div>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {currentAdmin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {currentAdmin?.name || 'Admin'}
            </div>
            <div className="text-xs text-white/50">
              {currentAdmin?.email || ''}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-[#F5A623] text-[#1C1C1C] shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#1C1C1C]' : 'text-white/70'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-medium text-left"
        >
          <LogOut className="w-5 h-5 text-white/70" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40 flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="font-bold text-[#1A3C8F]">Genius Admin</div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;