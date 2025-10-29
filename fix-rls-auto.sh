#!/bin/bash
# Auto-fix RLS script with instructions

echo "=========================================="
echo "🔧 AUTO FIX RLS POLICIES"
echo "=========================================="
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found"
    exit 1
fi

# Extract Supabase URL
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env.local | cut -d '=' -f2)
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL not found in .env.local"
    exit 1
fi

PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|\.supabase\.co||')
echo "✅ Found Supabase project: $PROJECT_ID"
echo ""

echo "📝 TO FIX RLS AUTOMATICALLY:"
echo ""
echo "OPTION 1 (Fastest - 2 minutes):"
echo "   1. Go to: https://app.supabase.com/project/$PROJECT_ID/sql/new"
echo "   2. Copy SQL from AUTO_FIX_RLS.sql"
echo "   3. Paste and click 'Run'"
echo "   4. Done! ✅"
echo ""
echo "OPTION 2 (For automation):"
echo "   1. Go to: https://app.supabase.com/project/$PROJECT_ID/settings/api"
echo "   2. Copy 'service_role' key (keep it secret!)"
echo "   3. Add to .env.local: VITE_SUPABASE_SERVICE_ROLE_KEY=your_key"
echo "   4. Run: node auto-fix-rls.js"
echo ""
echo "=========================================="
echo "📋 SQL TO COPY (from AUTO_FIX_RLS.sql):"
echo "=========================================="
cat AUTO_FIX_RLS.sql | head -30
echo "..."
echo "=========================================="

