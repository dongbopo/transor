#!/bin/bash

# 🚀 Quick Deploy to Production - Transer.app
# This script deploys the latest version to https://transer.app

echo "🚀 Deploying Transer to Production..."
echo "======================================"
echo ""

# Build first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🌐 Deploying to Vercel..."
echo ""

# Deploy using npx (no need to install globally)
npx vercel --prod

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Check Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Verify deployment at: https://transer.app"
echo "3. Test Google login functionality"
echo ""

