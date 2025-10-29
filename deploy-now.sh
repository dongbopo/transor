#!/usr/bin/env bash

echo "🚀 Transer Auto-Deploy Script"
echo "=============================="
echo ""
echo "📋 This script will:"
echo "   1. Build your app"
echo "   2. Deploy to Vercel production"
echo "   3. Update https://transer.app"
echo ""
echo "⚠️  First time? You'll need to login to Vercel"
echo "    (Opens browser - just login once!)"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

cd /Users/dongbo/transor

# Build
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Login check
if ! npx vercel whoami &> /dev/null; then
    echo "🔐 Need to login to Vercel..."
    echo "   Browser will open - please login there"
    echo ""
    npx vercel login
    
    if [ $? -ne 0 ]; then
        echo "❌ Login failed or canceled"
        exit 1
    fi
    
    echo ""
    echo "✅ Login successful!"
    echo ""
fi

# Deploy
echo "🌐 Deploying to production..."
npx vercel --prod --yes

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "✅ Check your app at: https://transer.app"
echo ""

