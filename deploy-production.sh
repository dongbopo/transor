#!/bin/bash

# 🚀 Transer Production Deployment Script
# Automates the deployment process to Vercel

set -e

echo "🚀 Transer Deployment Script"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please login:${NC}"
    vercel login
fi

# Build the project
echo -e "${GREEN}📦 Building project...${NC}"
npm run build

# Deploy to production
echo -e "${GREEN}🚀 Deploying to Vercel (production)...${NC}"
vercel --prod

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Add environment variables in Vercel Dashboard"
echo "2. Setup domain transer.app in Vercel"
echo "3. Update Google OAuth redirect URIs"
echo "4. Update Supabase site URL"
echo ""
echo "📖 See PRODUCTION_DEPLOY.md for detailed instructions"
echo ""

