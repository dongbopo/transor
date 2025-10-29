#!/bin/bash
# Quick deploy script - Run this to deploy

cd /Users/dongbo/transor

echo "🚀 Deploying Transer to Production..."
echo ""

# Check if logged in, if not prompt
if ! npx vercel whoami &> /dev/null; then
    echo "⚠️  Need to login to Vercel first"
    echo "Running: npx vercel login"
    echo "Please follow the prompts..."
    npx vercel login
fi

echo ""
echo "📦 Building..."
npm run build

echo ""
echo "🌐 Deploying to production..."
npx vercel --prod

echo ""
echo "✅ Done! Check https://transer.app"
