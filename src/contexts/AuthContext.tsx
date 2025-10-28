import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, APIKeys, LLMProvider } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateAPIKeys: (keys: Partial<APIKeys>) => void;
  updatePreferences: (prefs: Partial<User['preferences']>) => void;
  hasAPIKey: (provider: LLMProvider) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const createDefaultUser = (email: string, name?: string): User => ({
  id: Math.random().toString(36).substr(2, 9),
  email,
  name,
  apiKeys: {},
  preferences: {
    defaultProvider: 'openai',
    theme: 'system',
    language: 'en',
  },
  createdAt: new Date(),
  lastLogin: new Date(),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('transor_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('transor_users') || '[]');
    let user = existingUsers.find((u: User) => u.email === email);
    
    if (!user) {
      user = createDefaultUser(email);
      existingUsers.push(user);
      localStorage.setItem('transor_users', JSON.stringify(existingUsers));
    }
    
    user.lastLogin = new Date();
    localStorage.setItem('transor_user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = createDefaultUser(email, name);
    
    // Store in users list
    const existingUsers = JSON.parse(localStorage.getItem('transor_users') || '[]');
    existingUsers.push(user);
    localStorage.setItem('transor_users', JSON.stringify(existingUsers));
    
    localStorage.setItem('transor_user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('transor_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateAPIKeys = (keys: Partial<APIKeys>) => {
    if (!state.user) return;

    const updatedUser: User = {
      ...state.user,
      apiKeys: {
        ...state.user.apiKeys,
        ...keys,
      },
    };

    localStorage.setItem('transor_user', JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const updatePreferences = (prefs: Partial<User['preferences']>) => {
    if (!state.user) return;

    const updatedUser: User = {
      ...state.user,
      preferences: {
        ...state.user.preferences,
        ...prefs,
      },
    };

    localStorage.setItem('transor_user', JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const hasAPIKey = (provider: LLMProvider): boolean => {
    return !!(state.user?.apiKeys[provider]);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateAPIKeys,
        updatePreferences,
        hasAPIKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
