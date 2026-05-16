import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('genius_admin');
      if (saved) {
        setCurrentAdmin(JSON.parse(saved));
        setIsAdminAuthenticated(true);
      }
    } catch (e) {
      localStorage.removeItem('genius_admin');
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    const { data, error } = await supabase
      .from('admins')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Database error. Check RLS settings.');
    }

    if (!data || data.length === 0) {
      throw new Error('No admin records found in database.');
    }

    const admin = data.find(
      a =>
        a.email?.trim().toLowerCase() === email.trim().toLowerCase() &&
        a.password?.trim() === password.trim()
    );

    if (!admin) {
      throw new Error('Wrong email or password.');
    }

    localStorage.setItem('genius_admin', JSON.stringify(admin));
    setCurrentAdmin(admin);
    setIsAdminAuthenticated(true);
    return admin;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('genius_admin');
    setCurrentAdmin(null);
    setIsAdminAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ currentAdmin, isAdminAuthenticated, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};