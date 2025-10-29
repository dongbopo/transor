-- ========================================
-- FIX: Add missing columns to user_api_keys table
-- Run this in Supabase SQL Editor if you get schema errors
-- ========================================

-- Add last_validated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_api_keys' 
    AND column_name = 'last_validated_at'
  ) THEN
    ALTER TABLE public.user_api_keys 
    ADD COLUMN last_validated_at TIMESTAMP WITH TIME ZONE;
    
    RAISE NOTICE 'Added last_validated_at column';
  ELSE
    RAISE NOTICE 'Column last_validated_at already exists';
  END IF;
END $$;

-- Ensure is_valid column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_api_keys' 
    AND column_name = 'is_valid'
  ) THEN
    ALTER TABLE public.user_api_keys 
    ADD COLUMN is_valid BOOLEAN DEFAULT TRUE;
    
    RAISE NOTICE 'Added is_valid column';
  ELSE
    RAISE NOTICE 'Column is_valid already exists';
  END IF;
END $$;

-- Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_api_keys'
ORDER BY ordinal_position;

