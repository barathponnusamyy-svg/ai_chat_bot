import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Mic, MicOff, Volume2, VolumeX, Menu, Plus, Trash2, Home, Moon, Sun } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { sendMessage, testAPI } from '../services/aiService';
import speechService from '../services/speechService';

const ChatInterface = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const {
    sessions,
    currentSession,
    setCurrentSession,
    createNewSession,
    deleteSession,
    addMessage,
    isVoiceEnabled,
    setIsVoiceEnabled
  } = useChat();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSession(session);
      }
    } else if (!currentSession && sessions.length === 0) {
      const newSession = createNewSession();
      navigate(`/chat/${newSession.id}`, { replace: true });
    }
  }, [sessionId, sessions, currentSession, setCurrentSession, createNewSession, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, streamingResponse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    let session = currentSession;
    if (!session) {
      session = createNewSession();
      navigate(`/chat/${session.id}`, { replace: true });
    }

    addMessage(session.id, userMessage);
    setInput('');
    setIsLoading(true);
    setStreamingResponse('');

    try {
      const messages = [...session.messages, userMessage];
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await sendMessage(conversationHistory, (partial) => {
        setStreamingResponse(partial);
      });

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      addMessage(session.id, botMessage);
      setStreamingResponse('');

      // Speak the response if voice is enabled
      if (isVoiceEnabled) {
        speechService.speak(response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      addMessage(session.id, errorMessage);
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  const handleVoiceInput = () => {
    if (!speechService.isSupported) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.startListening(
        (transcript, isFinal) => {
          setInput(transcript);
          if (isFinal) {
            setIsListening(false);
            handleSendMessage(transcript);
          }
        },
        () => setIsListening(false),
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  const handleNewChat = () => {
    const newSession = createNewSession();
    navigate(`/chat/${newSession.id}`);
    setShowSidebar(false);
  };

  const handleDeleteSession = (sessionIdToDelete) => {
    deleteSession(sessionIdToDelete);
    if (currentSession?.id === sessionIdToDelete) {
      if (sessions.length > 1) {
        const remainingSession = sessions.find(s => s.id !== sessionIdToDelete);
        navigate(`/chat/${remainingSession.id}`);
      } else {
        navigate('/chat');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h2>
              <button
                onClick={handleNewChat}
                className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {!user && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm">
                <p className="text-blue-700 dark:text-blue-300 mb-2">💡 Sign in to save your chats</p>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Sign In
                </button>
              </div>
            )}
            {user && (
              <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg text-sm">
                <p className="text-green-700 dark:text-green-300">💾 Your chats are saved</p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                  currentSession?.id === session.id
                    ? 'bg-primary-100 dark:bg-primary-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => {
                  navigate(`/chat/${session.id}`);
                  setShowSidebar(false);
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Signed in as {user.username}
                </p>
                <button
                  onClick={logout}
                  className="w-full text-left text-sm text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentSession?.title || 'AI Assistant'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  isVoiceEnabled
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
                title={isVoiceEnabled ? 'Voice responses enabled' : 'Voice responses disabled'}
              >
                {isVoiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Home className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentSession?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`chat-bubble ${
                  message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                } animate-fade-in`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {streamingResponse && (
            <div className="flex justify-start">
              <div className="chat-bubble chat-bubble-bot animate-fade-in">
                <p className="whitespace-pre-wrap">{streamingResponse}</p>
                <div className="typing-indicator mt-1"></div>
              </div>
            </div>
          )}

          {isLoading && !streamingResponse && (
            <div className="flex justify-start">
              <div className="chat-bubble chat-bubble-bot">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? 'Listening...' : 'Type your message...'}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isLoading || isListening}
              />
            </div>

            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;