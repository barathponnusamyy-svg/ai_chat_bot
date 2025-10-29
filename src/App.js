import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatInterface from './components/ChatInterface';
import AuthModal from './components/AuthModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

// AWS Amplify configuration (disabled for now)
let amplifyConfigured = false;
if (process.env.REACT_APP_USER_POOL_ID && process.env.REACT_APP_USER_POOL_CLIENT_ID) {
  const { Amplify } = require('aws-amplify');
  const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
        region: process.env.REACT_APP_REGION || 'us-east-1'
      }
    }
  };
  Amplify.configure(amplifyConfig);
  amplifyConfigured = true;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      if (amplifyConfigured) {
        const { getCurrentUser } = require('aws-amplify/auth');
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/chat/:sessionId" element={<ChatInterface />} />
              </Routes>
              <AuthModal />
            </div>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;