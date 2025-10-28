import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, SubscriptionPlan } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (plan: SubscriptionPlan) => Promise<void>;
  deductTokens: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const MOCK_USER: User = {
  id: '1',
  email: 'demo@transor.com',
  name: 'Demo User',
  subscriptionPlan: 'free',
  tokensRemaining: 0,
  tokensTotal: 0,
  createdAt: new Date(),
};

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
      setState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      ...MOCK_USER,
      email,
    };
    
    localStorage.setItem('transor_user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (email: string, password: string, name?: string) => {
    // Mock signup - replace with actual API call
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      ...MOCK_USER,
      email,
      name,
    };
    
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

  const updateSubscription = async (plan: SubscriptionPlan) => {
    if (!state.user) return;

    const tokensByPlan = {
      free: 0,
      pro: 100000,
      enterprise: 1000000,
    };

    const updatedUser: User = {
      ...state.user,
      subscriptionPlan: plan,
      tokensTotal: tokensByPlan[plan],
      tokensRemaining: tokensByPlan[plan],
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    localStorage.setItem('transor_user', JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const deductTokens = (amount: number) => {
    if (!state.user) return;

    const updatedUser: User = {
      ...state.user,
      tokensRemaining: Math.max(0, state.user.tokensRemaining - amount),
    };

    localStorage.setItem('transor_user', JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateSubscription,
        deductTokens,
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

