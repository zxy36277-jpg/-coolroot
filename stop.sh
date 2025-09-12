#!/bin/bash

# 🛑 脚本文案助手停止脚本
# 作者: AI Assistant

echo "🛑 正在停止脚本文案助手..."
echo "=================================="

# 从PID文件读取进程ID
if [ -f "logs/server.pid" ]; then
    SERVER_PID=$(cat logs/server.pid)
    echo "📋 找到服务器PID: $SERVER_PID"
    
    # 检查进程是否还在运行
    if ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "🔄 正在停止服务器进程..."
        kill -TERM $SERVER_PID
        
        # 等待进程优雅退出
        sleep 3
        
        # 如果进程还在运行，强制终止
        if ps -p $SERVER_PID > /dev/null 2>&1; then
            echo "⚠️  强制终止进程..."
            kill -9 $SERVER_PID
        fi
        
        echo "✅ 服务器已停止"
    else
        echo "ℹ️  服务器进程已不存在"
    fi
    
    # 删除PID文件
    rm -f logs/server.pid
else
    echo "ℹ️  未找到PID文件"
fi

# 清理端口占用
echo ""
echo "🧹 清理端口占用..."

# 清理5119端口
if lsof -ti:5119 > /dev/null 2>&1; then
    echo "清理端口5119..."
    kill -9 $(lsof -ti:5119) 2>/dev/null || true
fi

# 清理3000端口
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "清理端口3000..."
    kill -9 $(lsof -ti:3000) 2>/dev/null || true
fi

echo "✅ 端口清理完成"
echo ""
echo "🎉 脚本文案助手已完全停止"
