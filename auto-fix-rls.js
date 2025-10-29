// Auto fix RLS policies for user_api_keys
// Run with: node auto-fix-rls.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Note: Service role key is needed to run SQL. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const FIX_SQL = `
-- Enable RLS
ALTER TABLE IF EXISTS public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_api_keys') LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.user_api_keys';
  END LOOP;
END $$;

-- Create policies
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

async function runSQL(sql) {
  try {
    // Use rpc to execute SQL (if function exists)
    // Otherwise, we need to use REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ sql_query: sql }),
    });

    if (response.ok) {
      return { success: true, data: await response.json() };
    } else {
      // Try alternative: direct database connection via PostgREST
      console.log('⚠️  RPC method not available, trying alternative...');
      throw new Error('RPC method not available');
    }
  } catch (error) {
    // Alternative: Use Supabase client with postgres functions
    console.log('⚠️  Direct SQL execution requires service_role key');
    console.log('   Please run the SQL manually in Supabase Dashboard');
    throw error;
  }
}

async function fixRLS() {
  console.log('🔧 Auto-fixing RLS policies for user_api_keys...\n');
  
  try {
    // Read SQL from file
    const sqlFile = join(__dirname, 'AUTO_FIX_RLS.sql');
    const sql = readFileSync(sqlFile, 'utf-8');
    
    console.log('📝 Attempting to run SQL automatically...\n');
    
    // Try to execute
    const result = await runSQL(sql);
    
    if (result.success) {
      console.log('✅ SUCCESS! RLS policies have been created.');
      console.log('   You can now save API keys in the app!\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Cannot execute SQL automatically.');
    console.error('   Error:', error.message);
    console.log('\n💡 SOLUTION: Run SQL manually in Supabase\n');
    console.log('   1. Go to https://app.supabase.com');
    console.log('   2. Open SQL Editor');
    console.log('   3. Copy content from AUTO_FIX_RLS.sql');
    console.log('   4. Paste and Run\n');
    
    // Show SQL to copy
    console.log('📋 SQL to copy:');
    console.log('='.repeat(50));
    console.log(FIX_SQL);
    console.log('='.repeat(50));
    
    return false;
  }
}

async function testAfterFix() {
  console.log('\n🧪 Testing after fix...\n');
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.log('⚠️  Not logged in. Please login in the app first.');
    return;
  }
  
  // Test save
  const testKey = 'test-key-' + Date.now();
  const { error } = await supabase
    .from('user_api_keys')
    .upsert({
      user_id: session.user.id,
      provider: 'openai',
      api_key_encrypted: testKey,
    });
  
  if (error) {
    console.error('❌ Test failed:', error.message);
    console.log('   RLS policies may not be fixed yet.\n');
  } else {
    console.log('✅ Test successful! RLS is working.');
    // Clean up
    await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', session.user.id)
      .eq('provider', 'openai');
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 AUTO FIX RLS POLICIES');
  console.log('='.repeat(60) + '\n');
  
  const fixed = await fixRLS();
  
  if (fixed) {
    await testAfterFix();
  }
  
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);

