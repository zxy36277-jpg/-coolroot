#!/bin/bash

# 脚本文案助手 - 静态文件部署脚本
# 支持多种静态托管平台

echo "🚀 开始构建静态文件..."

# 进入客户端目录
cd client

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist目录不存在"
    exit 1
fi

echo "✅ 构建完成！"

# 创建部署包
cd ..
echo "📦 创建部署包..."
tar -czf script-assistant-static.tar.gz -C client/dist .

echo "🎉 静态文件部署包已创建: script-assistant-static.tar.gz"
echo ""
echo "📋 部署说明："
echo "1. 解压 script-assistant-static.tar.gz 到任意静态托管平台"
echo "2. 支持的平台："
echo "   - GitHub Pages"
echo "   - Netlify"
echo "   - Vercel (静态模式)"
echo "   - 阿里云OSS"
echo "   - 腾讯云COS"
echo "   - 七牛云"
echo "   - 自建服务器"
echo ""
echo "🌐 访问地址示例："
echo "   - GitHub Pages: https://yourusername.github.io/script-assistant"
echo "   - Netlify: https://your-app-name.netlify.app"
echo "   - 自定义域名: https://your-domain.com"
