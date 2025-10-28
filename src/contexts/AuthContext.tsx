import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, APIKeys, LLMProvider, LicenseStatus } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateAPIKeys: (keys: Partial<APIKeys>) => void;
  updatePreferences: (prefs: Partial<User['preferences']>) => void;
  hasAPIKey: (provider: LLMProvider) => boolean;
  purchaseStorage: (amountGB: number) => Promise<void>;
  purchaseLicense: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data với storage & license
const createDefaultUser = (email: string, name?: string): User => ({
  id: Math.random().toString(36).substr(2, 9),
  email,
  name,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
  apiKeys: {},
  preferences: {
    defaultProvider: 'openai',
    theme: 'system',
    language: 'en',
    defaultReadingMode: 'parallel',
    fontSize: 16,
    lineHeight: 1.6,
  },
  licenseStatus: 'trial', // Start as trial
  storage: {
    totalGB: 5, // 5GB free with license
    usedGB: 0,
    availableGB: 5,
    usagePercentage: 0,
    documentsCount: 0,
  },
  storagePurchases: [],
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
    const storedUser = localStorage.getItem('transor_user_v2');
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
    
    // Check if user exists
    const existingUsers = JSON.parse(localStorage.getItem('transor_users_v2') || '[]');
    let user = existingUsers.find((u: User) => u.email === email);
    
    if (!user) {
      user = createDefaultUser(email);
      existingUsers.push(user);
      localStorage.setItem('transor_users_v2', JSON.stringify(existingUsers));
    }
    
    user.lastLogin = new Date();
    localStorage.setItem('transor_user_v2', JSON.stringify(user));
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
    const existingUsers = JSON.parse(localStorage.getItem('transor_users_v2') || '[]');
    existingUsers.push(user);
    localStorage.setItem('transor_users_v2', JSON.stringify(existingUsers));
    
    localStorage.setItem('transor_user_v2', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('transor_user_v2');
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

    localStorage.setItem('transor_user_v2', JSON.stringify(updatedUser));
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

    localStorage.setItem('transor_user_v2', JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const hasAPIKey = (provider: LLMProvider): boolean => {
    return !!(state.user?.apiKeys[provider]);
  };

  const purchaseStorage = async (amountGB: number) => {
    if (!state.user) return;

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pricePaid = amountGB * 5; // $5 per GB
    const purchase = {
      id: Math.random().toString(36).substr(2, 9),
      amountGB,
      pricePaid,
      purchasedAt: new Date(),
    };

    const updatedUser: User = {
      ...state.user,
      storage: {
        ...state.user.storage,
        totalGB: state.user.storage.totalGB + amountGB,
        availableGB: state.user.storage.availableGB + amountGB,
        usagePercentage: (state.user.storage.usedGB / (state.user.storage.totalGB + amountGB)) * 100,
      },
      storagePurchases: [...state.user.storagePurchases, purchase],
    };

    localStorage.setItem('transor_user_v2', JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const purchaseLicense = async () => {
    if (!state.user) return;

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser: User = {
      ...state.user,
      licenseStatus: 'active',
      licenseKey: `TRN-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
    };

    localStorage.setItem('transor_user_v2', JSON.stringify(updatedUser));
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
        updateAPIKeys,
        updatePreferences,
        hasAPIKey,
        purchaseStorage,
        purchaseLicense,
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
