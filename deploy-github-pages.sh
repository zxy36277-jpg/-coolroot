#!/bin/bash

echo "🚀 开始部署到GitHub Pages..."

# 确保在正确的目录
cd "$(dirname "$0")"

# 构建前端应用
echo "📦 构建前端应用..."
cd client
npm run build
cd ..

# 复制构建文件到根目录（GitHub Pages可能需要）
echo "📁 复制构建文件..."
cp -r client/dist/* .

# 检查文件是否存在
echo "🔍 检查关键文件..."
if [ -f "index.html" ]; then
    echo "✅ index.html 存在"
else
    echo "❌ index.html 不存在"
    exit 1
fi

if [ -d "assets" ]; then
    echo "✅ assets 目录存在"
    ls -la assets/
else
    echo "❌ assets 目录不存在"
    exit 1
fi

# 检查index.html中的资源路径
echo "🔍 检查资源路径..."
if grep -q "/-coolroot/assets/" index.html; then
    echo "✅ 资源路径正确"
else
    echo "❌ 资源路径可能有问题"
    cat index.html | grep -E "(src=|href=)"
fi

# 提交更改
echo "📝 提交更改..."
git add .
git commit -m "部署到GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到GitHub
echo "⬆️ 推送到GitHub..."
git push origin master

echo "✅ 部署完成！"
echo "🌐 访问地址: https://zxy36277-jpg.github.io/-coolroot/"
echo "⏰ 请等待几分钟让GitHub Pages更新"
