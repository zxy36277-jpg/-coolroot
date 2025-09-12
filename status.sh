#!/bin/bash

# 📊 脚本文案助手状态检查脚本
# 作者: AI Assistant

echo "📊 脚本文案助手状态检查"
echo "=================================="

# 检查服务器进程
if [ -f "logs/server.pid" ]; then
    SERVER_PID=$(cat logs/server.pid)
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "✅ 服务器状态: 运行中 (PID: $SERVER_PID)"
    else
        echo "❌ 服务器状态: 已停止"
    fi
else
    echo "❌ 服务器状态: 未启动"
fi

echo ""

# 检查端口占用
echo "🔍 端口占用检查:"

# 检查5119端口
if lsof -ti:5119 > /dev/null 2>&1; then
    echo "✅ 端口5119: 被占用 (后端API)"
else
    echo "❌ 端口5119: 空闲"
fi

# 检查3000端口
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ 端口3000: 被占用 (前端界面)"
else
    echo "❌ 端口3000: 空闲"
fi

echo ""

# 检查API健康状态
echo "🏥 API健康检查:"
if curl -s http://localhost:5119/api/health > /dev/null 2>&1; then
    echo "✅ 后端API: 正常响应"
else
    echo "❌ 后端API: 无响应"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 前端界面: 正常响应"
else
    echo "❌ 前端界面: 无响应"
fi

echo ""

# 显示访问地址
echo "🌐 访问地址:"
echo "   本地前端: http://localhost:3000"
echo "   本地后端: http://localhost:5119"
echo "   在线版本: https://zxy36277-jpg.github.io/-coolroot/"

echo ""

# 显示日志信息
if [ -f "logs/server.log" ]; then
    echo "📝 最近日志 (最后10行):"
    echo "----------------------------------------"
    tail -10 logs/server.log
    echo "----------------------------------------"
    echo ""
    echo "💡 查看完整日志: tail -f logs/server.log"
else
    echo "ℹ️  暂无日志文件"
fi

echo ""
echo "🛠️  管理命令:"
echo "   启动服务器: ./start.sh"
echo "   后台启动: ./start_background.sh"
echo "   停止服务器: ./stop.sh"
echo "   查看状态: ./status.sh"
