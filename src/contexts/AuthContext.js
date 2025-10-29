import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'

  const login = async (email, password) => {
    try {
      // Simple mock authentication - in real world this would be AWS Cognito
      const users = JSON.parse(localStorage.getItem('mock_users') || '{}');
      
      if (users[email] && users[email].password === password) {
        const mockUser = { username: email, email };
        setUser(mockUser);
        localStorage.setItem('current_user', JSON.stringify(mockUser));
        setShowAuthModal(false);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      // Simple mock registration - in real world this would be AWS Cognito
      const users = JSON.parse(localStorage.getItem('mock_users') || '{}');
      
      if (users[email]) {
        return { success: false, error: 'User already exists' };
      }
      
      users[email] = { password, createdAt: new Date().toISOString() };
      localStorage.setItem('mock_users', JSON.stringify(users));
      
      return { success: true, message: 'Account created successfully! Please sign in.' };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('current_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check for existing session on app load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      showAuthModal,
      authMode,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};