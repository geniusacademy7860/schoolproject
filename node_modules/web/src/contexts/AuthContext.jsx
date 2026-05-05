import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'student' or 'admin'
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
      setUserType(pb.authStore.model.collectionName);
    }
    setInitialLoading(false);
  }, []);

  const loginStudent = async (rollNumber, password) => {
    try {
      // Find student by rollNumber
      const students = await pb.collection('students').getFullList({
        filter: `rollNumber = "${rollNumber}"`,
        $autoCancel: false
      });

      if (students.length === 0) {
        throw new Error('Invalid roll number or password');
      }

      const student = students[0];
      
      // Authenticate with email and password
      const authData = await pb.collection('students').authWithPassword(
        student.email,
        password,
        { $autoCancel: false }
      );

      setCurrentUser(authData.record);
      setUserType('students');
      return authData.record;
    } catch (error) {
      console.error('Student login error:', error);
      throw new Error('Invalid roll number or password');
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const authData = await pb.collection('admin').authWithPassword(
        email,
        password,
        { $autoCancel: false }
      );

      setCurrentUser(authData.record);
      setUserType('admin');
      return authData.record;
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setUserType(null);
  };

  const value = {
    currentUser,
    userType,
    loginStudent,
    loginAdmin,
    logout,
    isAuthenticated: pb.authStore.isValid,
    isStudent: userType === 'students',
    isAdmin: userType === 'admin'
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};