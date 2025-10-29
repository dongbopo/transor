// Alternative: Try to fix RLS via Supabase REST API
// This may work if we have the right permissions

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPolicyIfNotExists(name, operation, condition) {
  try {
    // Check if policy exists by trying to create it
    // If it exists, we'll get an error which is fine
    console.log(`   Creating policy: ${name} (${operation})...`);
    
    // Note: We can't create RLS policies directly via Supabase JS client
    // This requires service_role key or direct database access
    // So we'll provide the SQL and instructions instead
    
    return false; // Indicates we need manual SQL execution
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`   ✓ Policy ${name} already exists`);
      return true;
    }
    throw error;
  }
}

async function main() {
  console.log('🔧 Attempting to fix RLS policies...\n');
  console.log('⚠️  Note: Creating RLS policies requires SERVICE_ROLE key');
  console.log('   or manual SQL execution in Supabase Dashboard.\n');
  
  console.log('📝 Please do one of the following:\n');
  console.log('OPTION 1 (Recommended): Run SQL in Supabase Dashboard');
  console.log('   1. Go to: https://app.supabase.com');
  console.log(`   2. Select project: ${supabaseUrl.split('//')[1].split('.')[0]}`);
  console.log('   3. Open SQL Editor');
  console.log('   4. Copy and run the SQL from AUTO_FIX_RLS.sql\n');
  
  console.log('OPTION 2: Add SERVICE_ROLE key to .env.local');
  console.log('   1. Go to Supabase Dashboard > Settings > API');
  console.log('   2. Copy "service_role" key (NOT anon key!)');
  console.log('   3. Add to .env.local: VITE_SUPABASE_SERVICE_ROLE_KEY=your_key');
  console.log('   4. Run: node auto-fix-rls.js\n');
  
  console.log('📋 Quick SQL to copy:');
  console.log('='.repeat(60));
  
  const sql = `
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can insert own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON public.user_api_keys;

CREATE POLICY "Users can view own API keys" 
ON public.user_api_keys FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" 
ON public.user_api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" 
ON public.user_api_keys FOR UPDATE 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" 
ON public.user_api_keys FOR DELETE USING (auth.uid() = user_id);
`;
  
  console.log(sql.trim());
  console.log('='.repeat(60));
}

main().catch(console.error);

