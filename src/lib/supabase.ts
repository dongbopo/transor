import { createClient } from '@supabase/supabase-js';

// Get these from Supabase Dashboard > Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Helper functions for auth
export const supabaseAuth = {
  // Sign up with email/password
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  // Sign in with email/password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    // Get redirect URL - use current origin (works for both localhost and production)
    const redirectTo = `${window.location.origin}${window.location.pathname === '/login' || window.location.pathname === '/signup' ? '/' : window.location.pathname}`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
      },
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Helper functions for storage
export const supabaseStorage = {
  // Upload file
  uploadFile: async (userId: string, file: File, path?: string) => {
    const fileName = path || `${userId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    return { data, error };
  },

  // Get public URL
  getPublicUrl: (path: string) => {
    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    return data.publicUrl;
  },

  // Download file
  downloadFile: async (path: string) => {
    const { data, error } = await supabase.storage.from('documents').download(path);
    return { data, error };
  },

  // Delete file
  deleteFile: async (path: string) => {
    const { data, error } = await supabase.storage.from('documents').remove([path]);
    return { data, error };
  },

  // List files
  listFiles: async (userId: string) => {
    const { data, error } = await supabase.storage.from('documents').list(userId);
    return { data, error };
  },
};

// Helper functions for database
export const supabaseDB = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Get user API keys
  getAPIKeys: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  // Save API key
  saveAPIKey: async (userId: string, provider: string, apiKey: string) => {
    const { data, error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: userId,
        provider,
        api_key_encrypted: apiKey, // TODO: Encrypt on backend
        is_valid: true,
        last_validated_at: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  // Get user documents
  getDocuments: async (userId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Create document
  createDocument: async (userId: string, document: any) => {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        ...document,
      })
      .select()
      .single();
    return { data, error };
  },

  // Update document
  updateDocument: async (documentId: string, updates: any) => {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)
      .select()
      .single();
    return { data, error };
  },

  // Delete document
  deleteDocument: async (documentId: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', documentId);
    return { error };
  },

  // Get translations for document
  getTranslations: async (documentId: string) => {
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('document_id', documentId)
      .order('page_number', { ascending: true });
    return { data, error };
  },

  // Save translation
  saveTranslation: async (translation: any) => {
    const { data, error } = await supabase
      .from('translations')
      .insert(translation)
      .select()
      .single();
    return { data, error };
  },
};

export default supabase;

