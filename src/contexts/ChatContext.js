import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSessions = () => {
    if (user) {
      // Load persistent sessions for authenticated users
      const saved = localStorage.getItem(`chat_sessions_${user.username}`);
      setSessions(saved ? JSON.parse(saved) : []);
    } else {
      // No sessions for anonymous users - they start fresh each time
      setSessions([]);
    }
  };

  const saveSessions = (newSessions) => {
    if (user) {
      // Save sessions for authenticated users
      localStorage.setItem(`chat_sessions_${user.username}`, JSON.stringify(newSessions));
      setSessions(newSessions);
    } else {
      // For anonymous users, only keep current session in memory
      setSessions(newSessions);
    }
  };

  const createNewSession = () => {
    const newSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newSessions = [newSession, ...sessions];
    saveSessions(newSessions);
    setCurrentSession(newSession);
    return newSession;
  };

  const updateSession = (sessionId, updates) => {
    const newSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, ...updates, updatedAt: new Date().toISOString() }
        : session
    );
    saveSessions(newSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession({ ...currentSession, ...updates });
    }
  };

  const deleteSession = (sessionId) => {
    const newSessions = sessions.filter(session => session.id !== sessionId);
    saveSessions(newSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  const addMessage = (sessionId, message) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const newMessages = [...session.messages, message];
    const title = session.messages.length === 0 ? 
      message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '') : 
      session.title;

    updateSession(sessionId, { messages: newMessages, title });
  };

  return (
    <ChatContext.Provider value={{
      sessions,
      currentSession,
      setCurrentSession,
      createNewSession,
      updateSession,
      deleteSession,
      addMessage,
      isVoiceEnabled,
      setIsVoiceEnabled
    }}>
      {children}
    </ChatContext.Provider>
  );
};