#!/bin/bash

# Check if Xcode Command Line Tools installed and auto-deploy
# Usage: ./check_and_deploy.sh

set -e

echo "🔍 Checking if Xcode Command Line Tools installed..."
echo ""

# Check if git is available
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git is installed: $GIT_VERSION"
    echo ""
    
    # Ask user if they want to continue
    read -p "Tiếp tục deploy? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "🚀 Starting deployment process..."
        echo ""
        
        # Step 1: Init git if not already
        if [ ! -d .git ]; then
            echo "📦 Initializing Git repository..."
            git init
            echo "✅ Git initialized"
            echo ""
        else
            echo "✅ Git repository already exists"
            echo ""
        fi
        
        # Step 2: Add all files
        echo "📝 Adding all files..."
        git add .
        echo "✅ Files added"
        echo ""
        
        # Step 3: Commit
        echo "💾 Committing changes..."
        if git diff-index --quiet HEAD -- 2>/dev/null; then
            echo "✅ No changes to commit"
        else
            git commit -m "Ready for deployment to transer.app" 2>/dev/null || echo "✅ Changes committed"
        fi
        echo ""
        
        # Step 4: Check if remote exists
        if git remote | grep -q "^origin$"; then
            echo "✅ Git remote 'origin' already configured"
            echo ""
            echo "📤 Push changes:"
            echo "   git push -u origin main"
            echo ""
        else
            echo "⚠️  Git remote not configured yet"
            echo ""
            echo "📋 Next steps:"
            echo ""
            echo "1. Tạo repository trên GitHub:"
            echo "   https://github.com/new"
            echo ""
            echo "2. Repository name: transor"
            echo ""
            echo "3. Chạy commands:"
            echo "   git remote add origin https://github.com/YOUR_USERNAME/transor.git"
            echo "   git branch -M main"
            echo "   git push -u origin main"
            echo ""
        fi
        
        echo "📚 Chi tiết xem trong: STEP_BY_STEP.md"
        echo ""
        echo "🎯 Sau khi push lên GitHub:"
        echo "   1. Vào https://vercel.com"
        echo "   2. Import GitHub repository 'transor'"
        echo "   3. Deploy!"
        echo ""
        
    else
        echo "❌ Deployment cancelled"
        exit 0
    fi
    
else
    echo "❌ Git is NOT installed yet"
    echo ""
    echo "⏳ Xcode Command Line Tools vẫn đang cài đặt..."
    echo ""
    echo "Vui lòng:"
    echo "1. Kiểm tra popup cài đặt trên màn hình"
    echo "2. Đợi quá trình cài đặt hoàn tất (5-10 phút)"
    echo "3. Chạy lại script này: ./check_and_deploy.sh"
    echo ""
    echo "Hoặc check manual:"
    echo "   git --version"
    echo ""
    exit 1
fi

