-- ========================================
-- AUTO FIX RLS - Copy toàn bộ và chạy trong Supabase SQL Editor
-- ========================================

-- Verify table exists first
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_api_keys'
  ) THEN
    RAISE EXCEPTION 'Table user_api_keys does not exist! Please create it first.';
  END IF;
END $$;

-- Step 1: Enable RLS
ALTER TABLE IF EXISTS public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies for this table
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_api_keys') LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.user_api_keys';
  END LOOP;
END $$;

-- Step 3: Create comprehensive policies
CREATE POLICY "Users can view own API keys" 
ON public.user_api_keys 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" 
ON public.user_api_keys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" 
ON public.user_api_keys 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" 
ON public.user_api_keys 
FOR DELETE 
USING (auth.uid() = user_id);

-- Step 4: Verify policies were created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE tablename = 'user_api_keys';
  
  IF policy_count >= 4 THEN
    RAISE NOTICE '✅ SUCCESS: Created % RLS policies for user_api_keys', policy_count;
    RAISE NOTICE '   Policies: SELECT, INSERT, UPDATE, DELETE';
    RAISE NOTICE '   You can now save API keys in the app!';
  ELSE
    RAISE WARNING '⚠️  Only % policies created. Expected 4.', policy_count;
  END IF;
END $$;

-- Show all policies
SELECT 
  policyname as "Policy Name",
  cmd as "Command",
  qual as "Condition"
FROM pg_policies
WHERE tablename = 'user_api_keys'
ORDER BY cmd, policyname;

