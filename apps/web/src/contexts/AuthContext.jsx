import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
      setUserType(pb.authStore.model.collectionName);
      setIsAuthenticated(true);
    }
    setInitialLoading(false);
  }, []);

  const loginStudent = async (email, password) => {
    try {
      const authData = await pb.collection('Student').authWithPassword(
        email, password, { $autoCancel: false }
      );
      setCurrentUser(authData.record);
      setUserType('Student');
      setIsAuthenticated(true);
      return authData.record;
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const authData = await pb.collection('Admin').authWithPassword(
        email, password, { $autoCancel: false }
      );
      setCurrentUser(authData.record);
      setUserType('Admin');
      setIsAuthenticated(true);
      return authData.record;
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setUserType(null);
    setIsAuthenticated(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser, userType, loginStudent, loginAdmin, logout,
      isAuthenticated,
      isStudent: userType === 'Student',
      isAdmin: userType === 'Admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};