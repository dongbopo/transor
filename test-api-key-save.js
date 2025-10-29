// Quick test script to check Supabase connection
// Run with: node test-api-key-save.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRLSPolicies() {
  console.log('🔍 Checking RLS policies...\n');
  
  try {
    // Try to query policies
    const { data, error } = await supabase
      .rpc('pg_policies', { table_name: 'user_api_keys' });
    
    if (error) {
      console.log('⚠️  Cannot check policies directly (normal)');
      console.log('   Need to check in Supabase Dashboard > Database > Policies\n');
    } else {
      console.log('✅ Policies found:', data?.length || 0);
    }
  } catch (e) {
    console.log('⚠️  Cannot check policies (need to check in Supabase Dashboard)');
  }
}

async function testSaveAPIKey() {
  console.log('🧪 Testing API key save...\n');
  
  // Get current user (if any)
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.error('❌ No user session. Please login first in the app.');
    console.log('   Then run this test again.');
    return;
  }
  
  console.log('✅ User logged in:', session.user.email);
  console.log('   User ID:', session.user.id, '\n');
  
  // Test save
  const testKey = 'test-key-' + Date.now();
  const { data, error } = await supabase
    .from('user_api_keys')
    .upsert({
      user_id: session.user.id,
      provider: 'openai',
      api_key_encrypted: testKey,
    })
    .select();
  
  if (error) {
    console.error('❌ SAVE FAILED:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error.details);
    console.error('\n💡 Solution: Run FIX_RLS_SIMPLE.sql in Supabase SQL Editor\n');
    return false;
  } else {
    console.log('✅ SAVE SUCCESS! RLS policies are working.\n');
    
    // Clean up test key
    await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', session.user.id)
      .eq('provider', 'openai');
    
    return true;
  }
}

async function main() {
  console.log('='.repeat(50));
  console.log('🔧 Supabase RLS Policy Test');
  console.log('='.repeat(50) + '\n');
  
  await testRLSPolicies();
  await testSaveAPIKey();
  
  console.log('='.repeat(50));
  console.log('📝 Next steps:');
  console.log('   1. If test failed, run FIX_RLS_SIMPLE.sql in Supabase');
  console.log('   2. Then test again in the app');
  console.log('='.repeat(50));
}

main().catch(console.error);

