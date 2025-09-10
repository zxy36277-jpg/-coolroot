#!/bin/bash

echo "🚀 开始部署脚本文案助手..."

# 检查Node.js版本
echo "📋 检查环境..."
node --version
npm --version

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

echo "✅ 构建完成！"
echo ""
echo "📋 部署选项："
echo "1. Vercel: https://vercel.com"
echo "2. Railway: https://railway.app"
echo "3. Render: https://render.com"
echo ""
echo "📁 构建文件位置："
echo "- 前端: client/dist/"
echo "- 后端: dist/"
echo ""
echo "🔗 部署后记得更新 client/src/services/api.ts 中的API地址"