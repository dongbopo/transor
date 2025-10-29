-- ========================================
-- QUICK FIX: Copy và paste toàn bộ vào Supabase SQL Editor
-- ========================================

-- Step 1: Enable RLS
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop old policies (if exist)
DROP POLICY IF EXISTS "Users can view own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can manage own API keys" ON public.user_api_keys;

-- Step 3: Create new policies
CREATE POLICY "Users can view own API keys" 
ON public.user_api_keys FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" 
ON public.user_api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" 
ON public.user_api_keys FOR UPDATE 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" 
ON public.user_api_keys FOR DELETE USING (auth.uid() = user_id);

-- Done! Test by saving an API key in the app.

