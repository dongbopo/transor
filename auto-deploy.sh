#!/bin/bash

# 🚀 Auto Deploy Script for Transer.app
# Run this ONCE to login, then it will auto-deploy

set -e

echo "🚀 Transer Auto-Deployment Script"
echo "=================================="
echo ""

cd /Users/dongbo/transor

# Check if already logged in
if npx vercel whoami &> /dev/null; then
    echo "✅ Already logged in to Vercel"
    echo ""
else
    echo "🔐 Need to login to Vercel first..."
    echo "Opening browser for login..."
    echo ""
    npx vercel login
    echo ""
fi

# Build project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Deploy to production
echo "🌐 Deploying to production (transer.app)..."
echo ""

npx vercel --prod --yes

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "✅ Check your site at: https://transer.app"
echo ""

