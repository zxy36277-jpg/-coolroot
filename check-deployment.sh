#!/bin/bash

echo "🚀 开始部署检查..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node --version
npm --version

# 检查项目结构
echo "📁 检查项目结构..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json 不存在"
    exit 1
fi

if [ ! -f "src/server.ts" ]; then
    echo "❌ src/server.ts 不存在"
    exit 1
fi

if [ ! -f "client/package.json" ]; then
    echo "❌ client/package.json 不存在"
    exit 1
fi

echo "✅ 项目结构检查通过"

# 安装依赖
echo "📦 安装依赖..."
npm run install:all

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
echo "🔍 检查构建结果..."
if [ ! -f "dist/server.js" ]; then
    echo "❌ 服务器构建失败"
    exit 1
fi

if [ ! -f "client/dist/index.html" ]; then
    echo "❌ 客户端构建失败"
    exit 1
fi

echo "✅ 构建检查通过"

# 检查环境变量
echo "🔧 检查环境变量..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，创建示例文件..."
    cp env.example .env
    echo "请编辑 .env 文件配置API密钥"
fi

# 启动服务器测试
echo "🚀 启动服务器测试..."
npm start &
SERVER_PID=$!

# 等待服务器启动
sleep 5

# 测试API端点
echo "🧪 测试API端点..."

# 测试健康检查
if curl -s http://localhost:5119/api/health > /dev/null; then
    echo "✅ 健康检查API正常"
else
    echo "❌ 健康检查API失败"
    kill $SERVER_PID
    exit 1
fi

# 测试会话创建
SESSION_RESPONSE=$(curl -s -X POST http://localhost:5119/api/sessions)
if echo "$SESSION_RESPONSE" | grep -q "success.*true"; then
    echo "✅ 会话创建API正常"
    SESSION_ID=$(echo "$SESSION_RESPONSE" | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)
    echo "会话ID: $SESSION_ID"
else
    echo "❌ 会话创建API失败"
    kill $SERVER_PID
    exit 1
fi

# 测试文件上传
echo "📁 测试文件上传..."
echo "品牌名称：Apple
行业：3c数码
视频目的：广告营销卖货
平台：抖音、小红书
核心卖点：高性能、优质材料、性价比高
目标受众：25-35岁用户
促销信息：限时优惠，欢迎咨询
禁用词汇：最好，第一，绝对" > test_upload.txt

if curl -s -X POST -F "file=@test_upload.txt" http://localhost:5119/api/upload | grep -q "success.*true"; then
    echo "✅ 文件上传API正常"
else
    echo "❌ 文件上传API失败"
    kill $SERVER_PID
    exit 1
fi

# 清理测试文件
rm -f test_upload.txt

# 停止服务器
kill $SERVER_PID

echo "🎉 所有检查通过！项目可以正常部署"
echo ""
echo "📋 部署说明："
echo "1. 确保已配置 .env 文件中的API密钥"
echo "2. 运行 'npm start' 启动服务器"
echo "3. 访问 http://localhost:5119 使用应用"
echo "4. 或使用 Vercel 等平台进行云端部署"