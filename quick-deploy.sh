#!/bin/bash

# 快速部署脚本 - 脚本文案助手

echo "🚀 脚本文案助手快速部署"
echo "=========================="

# 检查Git状态
if [ ! -d ".git" ]; then
    echo "❌ 错误：这不是一个Git仓库"
    exit 1
fi

# 显示当前状态
echo "📋 当前状态："
git status --porcelain
echo ""

# 选择部署方式
echo "请选择部署方式："
echo "1. 推送到GitHub (需要配置远程仓库)"
echo "2. 部署到Vercel"
echo "3. 部署到Netlify"
echo "4. 仅构建项目"
echo ""
read -p "请输入选择 (1-4): " choice

case $choice in
    1)
        echo "🌐 推送到GitHub..."
        
        # 检查远程仓库
        if ! git remote get-url origin >/dev/null 2>&1; then
            echo "请先配置远程仓库："
            read -p "输入GitHub仓库URL: " repo_url
            git remote add origin "$repo_url"
        fi
        
        # 添加所有更改
        git add .
        
        # 提交更改
        read -p "输入提交信息 (默认: Update): " commit_msg
        commit_msg=${commit_msg:-"Update"}
        git commit -m "$commit_msg"
        
        # 推送到GitHub
        git push origin main
        
        echo "✅ 代码已推送到GitHub！"
        echo "📝 下一步："
        echo "   1. 在GitHub仓库设置中启用GitHub Pages"
        echo "   2. 配置环境变量 OPENAI_API_KEY"
        echo "   3. 等待GitHub Actions自动部署"
        ;;
        
    2)
        echo "🌐 部署到Vercel..."
        
        # 检查Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "安装Vercel CLI..."
            npm install -g vercel
        fi
        
        # 登录Vercel
        vercel login
        
        # 部署
        vercel --prod
        
        echo "✅ 部署到Vercel完成！"
        echo "📝 下一步："
        echo "   1. 在Vercel控制台配置环境变量"
        echo "   2. 设置 OPENAI_API_KEY"
        ;;
        
    3)
        echo "🌐 部署到Netlify..."
        
        # 检查Netlify CLI
        if ! command -v netlify &> /dev/null; then
            echo "安装Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        # 构建项目
        echo "🔨 构建项目..."
        npm install
        cd client && npm install && npm run build && cd ..
        npm run build:server
        
        # 部署
        netlify deploy --prod --dir=client/dist
        
        echo "✅ 部署到Netlify完成！"
        echo "📝 下一步："
        echo "   1. 在Netlify控制台配置环境变量"
        echo "   2. 设置 OPENAI_API_KEY"
        ;;
        
    4)
        echo "🔨 构建项目..."
        
        # 安装依赖
        npm install
        cd client && npm install && cd ..
        
        # 构建前端
        echo "构建前端..."
        cd client && npm run build && cd ..
        
        # 构建后端
        echo "构建后端..."
        npm run build:server
        
        echo "✅ 构建完成！"
        echo "📁 前端构建文件: client/dist/"
        echo "📁 后端构建文件: dist/"
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署流程完成！"
echo ""
echo "📚 更多信息请查看:"
echo "   - README.md: 项目说明"
echo "   - DEPLOYMENT.md: 详细部署指南"
echo ""
