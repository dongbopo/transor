import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, APIKeys, LLMProvider, LicenseStatus } from '../types';
import { supabaseAuth, supabaseDB, supabase } from '../lib/supabase';
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
    
    // Load API keys from database
    const { data: apiKeysData } = await supabaseDB.getAPIKeys(supabaseUser.id);
    const apiKeys: APIKeys = {
      openai: '',
      gemini: '',
      grok: '',
      claude: '',
    };
    
    if (apiKeysData) {
      apiKeysData.forEach((keyData: any) => {
        if (keyData.provider && keyData.api_key_encrypted) {
          apiKeys[keyData.provider as keyof APIKeys] = keyData.api_key_encrypted;
        }
      });
    }

    // Load preferences from profile
    let preferences = {
      defaultProvider: 'openai' as const,
      theme: 'system' as const,
      language: 'en',
      defaultReadingMode: 'parallel' as const,
      fontSize: 16,
      lineHeight: 1.6,
    };

    if (profile?.preferences) {
      try {
        preferences = typeof profile.preferences === 'string' 
          ? JSON.parse(profile.preferences) 
          : profile.preferences;
      } catch (e) {
        console.error('Error parsing preferences:', e);
      }
    }
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.full_name || supabaseUser.user_metadata?.full_name || '',
      avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
      apiKeys,
      preferences,
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
        if (apiKey && apiKey.trim()) {
          const { error } = await supabaseDB.saveAPIKey(state.user.id, provider, apiKey);
          if (error) {
            console.error(`Error saving ${provider} API key:`, error);
            throw new Error(`Failed to save ${provider} API key: ${error.message}`);
          }
        } else if (apiKey === '' || apiKey === null) {
          // Delete API key if empty
          const { error } = await supabase
            .from('user_api_keys')
            .delete()
            .eq('user_id', state.user.id)
            .eq('provider', provider);
          if (error) {
            console.error(`Error deleting ${provider} API key:`, error);
          }
        }
      }

      // Reload API keys from database to ensure sync
      const { data: apiKeysData } = await supabaseDB.getAPIKeys(state.user.id);
      const updatedApiKeys: APIKeys = {
        openai: '',
        gemini: '',
        grok: '',
        claude: '',
      };
      
      if (apiKeysData) {
        apiKeysData.forEach((keyData: any) => {
          if (keyData.provider && keyData.api_key_encrypted) {
            updatedApiKeys[keyData.provider as keyof APIKeys] = keyData.api_key_encrypted;
          }
        });
      }

      // Update local state
      const updatedUser: User = {
        ...state.user,
        apiKeys: updatedApiKeys,
      };

      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error: any) {
      console.error('Error saving API keys:', error);
      throw error; // Re-throw to show error to user
    }
  };

  const updatePreferences = async (prefs: Partial<User['preferences']>) => {
    if (!state.user) return;

    try {
      const updatedPreferences = {
        ...state.user.preferences,
        ...prefs,
      };

      // Update in Supabase (store as JSON string)
      const { error } = await supabaseDB.updateProfile(state.user.id, {
        preferences: JSON.stringify(updatedPreferences),
      });

      if (error) {
        throw new Error(`Failed to save preferences: ${error.message}`);
      }

      // Update local state
      const updatedUser: User = {
        ...state.user,
        preferences: updatedPreferences,
      };

      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      throw error; // Re-throw to show error to user
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
