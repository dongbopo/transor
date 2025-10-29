-- ========================================
-- FIX: Row Level Security (RLS) Policies for user_api_keys
-- Run this in Supabase SQL Editor to fix API key save errors
-- ========================================

-- Enable RLS if not already enabled
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can manage own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can insert own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON public.user_api_keys;

-- Create specific policies for each operation
-- SELECT: Users can view their own API keys
CREATE POLICY "Users can view own API keys" 
ON public.user_api_keys 
FOR SELECT 
USING (auth.uid() = user_id);

-- INSERT: Users can insert their own API keys
CREATE POLICY "Users can insert own API keys" 
ON public.user_api_keys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own API keys
CREATE POLICY "Users can update own API keys" 
ON public.user_api_keys 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own API keys
CREATE POLICY "Users can delete own API keys" 
ON public.user_api_keys 
FOR DELETE 
USING (auth.uid() = user_id);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_api_keys'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies for user_api_keys have been created successfully!';
  RAISE NOTICE 'You should now be able to save API keys without errors.';
END $$;

