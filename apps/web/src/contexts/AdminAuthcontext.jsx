import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentAdmin(pb.authStore.model);
      setIsAdminAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const authData = await pb.collection('Admin').authWithPassword(
        email,
        password,
        { $autoCancel: false }
      );
      setCurrentAdmin(authData.record);
      setIsAdminAuthenticated(true);
      return authData.record;
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error('Invalid email or password');
    }
  };

  const logoutAdmin = () => {
    pb.authStore.clear();
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
    <AdminAuthContext.Provider value={{ currentAdmin, isAdminAuthenticated, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};