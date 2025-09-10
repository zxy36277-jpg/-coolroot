#!/bin/bash

# 脚本文案助手部署脚本

echo "🚀 开始部署脚本文案助手..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建前端
echo "🔨 构建前端..."
cd client
npm install
npm run build
cd ..

# 构建后端
echo "🔨 构建后端..."
npm run build:server

# 检查构建结果
if [ ! -d "client/dist" ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

if [ ! -d "dist" ]; then
    echo "❌ 后端构建失败"
    exit 1
fi

echo "✅ 构建完成！"
echo ""
echo "📋 部署选项："
echo "1. GitHub Pages (静态前端)"
echo "2. Vercel (全栈应用)"
echo "3. 本地测试"
echo ""
echo "请选择部署方式 (1-3):"
read -r choice

case $choice in
    1)
        echo "🌐 准备部署到GitHub Pages..."
        echo "请确保已配置GitHub仓库和GitHub Actions"
        ;;
    2)
        echo "🌐 准备部署到Vercel..."
        echo "请确保已安装Vercel CLI: npm i -g vercel"
        echo "运行: vercel --prod"
        ;;
    3)
        echo "🧪 启动本地测试服务器..."
        npm start
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo "🎉 部署准备完成！"
