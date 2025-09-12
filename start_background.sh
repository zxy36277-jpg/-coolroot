#!/bin/bash

# 🚀 脚本文案助手后台启动脚本
# 作者: AI Assistant
# 日期: $(date)

echo "🎬 脚本文案助手后台启动中..."
echo "=================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 检查端口占用情况
echo ""
echo "🔍 检查端口占用情况..."

# 检查5119端口
if lsof -ti:5119 > /dev/null 2>&1; then
    echo "⚠️  端口5119被占用，正在终止进程..."
    kill -9 $(lsof -ti:5119) 2>/dev/null || true
    sleep 2
fi

# 检查3000端口
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  端口3000被占用，正在终止进程..."
    kill -9 $(lsof -ti:3000) 2>/dev/null || true
    sleep 2
fi

echo "✅ 端口检查完成"

# 安装依赖
echo ""
echo "📦 检查并安装依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装根目录依赖..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "安装客户端依赖..."
    cd client && npm install && cd ..
fi

echo "✅ 依赖安装完成"

# 创建日志目录
mkdir -p logs

# 启动服务器
echo ""
echo "🚀 启动后台服务器..."
echo "=================================="
echo "📱 前端界面: http://localhost:3000"
echo "🔧 后端API: http://localhost:5119"
echo "🌐 GitHub Pages: https://zxy36277-jpg.github.io/-coolroot/"
echo "=================================="
echo ""
echo "📝 日志文件: logs/server.log"
echo "🛑 停止服务器: ./stop.sh"
echo ""

# 启动开发服务器并记录日志
nohup npm run dev > logs/server.log 2>&1 &
SERVER_PID=$!

# 保存PID到文件
echo $SERVER_PID > logs/server.pid

echo "✅ 服务器已启动，PID: $SERVER_PID"
echo "✅ 服务器正在后台运行..."
echo ""
echo "💡 使用以下命令管理服务器:"
echo "   查看状态: ./status.sh"
echo "   查看日志: tail -f logs/server.log"
echo "   停止服务器: ./stop.sh"
