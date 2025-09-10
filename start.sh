#!/bin/bash

# 短视频电商运营脚本助手启动脚本

echo "🚀 启动短视频电商运营脚本助手..."

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 错误: Node.js版本过低，需要18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js版本检查通过: $(node -v)"

# 检查是否存在.env文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到.env文件，将使用默认配置"
    echo "如需配置DeepSeek API，请创建.env文件并设置DEEPSEEK_API_KEY"
fi

# 安装依赖
echo "📦 安装后端依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败"
    exit 1
fi

echo "📦 安装前端依赖..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi

cd ..

# 创建必要的目录
echo "📁 创建必要目录..."
mkdir -p data
mkdir -p uploads

# 构建前端
echo "🔨 构建前端..."
cd client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

cd ..

# 构建后端
echo "🔨 构建后端..."
npm run build:server

if [ $? -ne 0 ]; then
    echo "❌ 后端构建失败"
    exit 1
fi

# 启动服务器
echo "🌟 启动服务器..."
echo ""
echo "📱 本地访问地址:"
echo "   前端界面: http://localhost:5119"
echo "   后端API:  http://localhost:5119/api"
echo ""
echo "🌐 网络访问地址:"
echo "   前端界面: http://192.168.1.24:5119"
echo "   后端API:  http://192.168.1.24:5119/api"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm start
