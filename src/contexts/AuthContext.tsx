import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, APIKeys, LLMProvider, LicenseStatus } from '../types';
import { supabaseAuth, supabaseDB } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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

  // Map Supabase user to our User type
  const mapSupabaseUserToUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    // Get user profile from database
    const { data: profile } = await supabaseDB.getProfile(supabaseUser.id);
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.full_name || supabaseUser.user_metadata?.full_name || '',
      avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
      apiKeys: {},
      preferences: {
        defaultProvider: 'openai',
        theme: 'system',
        language: 'en',
        defaultReadingMode: 'parallel',
        fontSize: 16,
        lineHeight: 1.6,
      },
      licenseStatus: (profile?.license_status as LicenseStatus) || 'trial',
      licenseKey: profile?.license_key,
      storage: {
        totalGB: profile?.storage_total_gb || 5,
        usedGB: profile?.storage_used_gb || 0,
        availableGB: (profile?.storage_total_gb || 5) - (profile?.storage_used_gb || 0),
        usagePercentage: ((profile?.storage_used_gb || 0) / (profile?.storage_total_gb || 5)) * 100,
        documentsCount: 0,
      },
      storagePurchases: [],
      createdAt: new Date(profile?.created_at || supabaseUser.created_at),
      lastLogin: new Date(),
    };
  };

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabaseAuth.getSession();
        
        if (session?.user) {
          const user = await mapSupabaseUserToUser(session.user);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Session check error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    // Listen to auth state changes
    const { data: { subscription } } = supabaseAuth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await mapSupabaseUserToUser(session.user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabaseAuth.signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        const user = await mapSupabaseUserToUser(data.user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabaseAuth.signUp(email, password, name || '');
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // User created successfully
        // Supabase will send confirmation email if enabled
        // For now, we'll just auto-login
        const user = await mapSupabaseUserToUser(data.user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      await supabaseAuth.signOut();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateAPIKeys = async (keys: Partial<APIKeys>) => {
    if (!state.user) return;

    try {
      // Save to Supabase database
      for (const [provider, apiKey] of Object.entries(keys)) {
        if (apiKey) {
          await supabaseDB.saveAPIKey(state.user.id, provider, apiKey);
        }
      }

      // Update local state
      const updatedUser: User = {
        ...state.user,
        apiKeys: {
          ...state.user.apiKeys,
          ...keys,
        },
      };

      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error('Error saving API keys:', error);
    }
  };

  const updatePreferences = async (prefs: Partial<User['preferences']>) => {
    if (!state.user) return;

    try {
      // Update in Supabase
      await supabaseDB.updateProfile(state.user.id, {
        preferences: {
          ...state.user.preferences,
          ...prefs,
        },
      });

      // Update local state
      const updatedUser: User = {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...prefs,
        },
      };

      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
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
