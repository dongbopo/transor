#!/bin/bash

# Transor Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Deploying Transor to transer.app..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${BLUE}📦 Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit"
    echo -e "${GREEN}✅ Git initialized${NC}"
    echo ""
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${BLUE}📝 Committing changes...${NC}"
    git add .
    read -p "Commit message: " commit_msg
    git commit -m "$commit_msg"
    echo -e "${GREEN}✅ Changes committed${NC}"
    echo ""
fi

# Build
echo -e "${BLUE}🔨 Building production bundle...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    echo ""
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Check if Vercel is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${BLUE}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
    echo ""
fi

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Go to Vercel dashboard"
    echo "2. Settings → Domains"
    echo "3. Add domain: transer.app"
    echo "4. Configure DNS on Namecheap with Vercel's records"
    echo ""
    echo -e "${GREEN}🎉 Your site will be live at https://transer.app in a few minutes!${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

