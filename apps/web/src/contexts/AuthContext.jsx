import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('genius_student');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
        setIsAuthenticated(true);
      }
    } catch (e) {
      localStorage.removeItem('genius_student');
    }
    setInitialLoading(false);
  }, []);

  const loginStudent = async (email, password) => {
    const { data, error } = await supabase
      .from('Students')
      .select('*')
      .eq('email', email.trim())
      .eq('password', password.trim())
      .maybeSingle();

    if (error) throw new Error('Database error: ' + error.message);
    if (!data) throw new Error('Invalid email or password');

    const student = {
      id: data.id,
      name: data.name,
      email: data.email,
      rollNumber: data.roll_number?.toString(),
      class: data.class,
      section: data.section,
      fatherName: data.father_name,
      motherName: data.mother_name,
      fatherMobile: data.father_mobile,
    };

    localStorage.setItem('genius_student', JSON.stringify(student));
    setCurrentUser(student);
    setIsAuthenticated(true);
    return student;
  };

  const logout = () => {
    localStorage.removeItem('genius_student');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser, loginStudent, logout,
      isAuthenticated, isStudent: !!currentUser,
      initialLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};