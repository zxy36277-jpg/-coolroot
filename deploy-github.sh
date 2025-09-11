#!/bin/bash

# 脚本文案助手 - GitHub Pages 快速部署脚本

echo "🚀 开始GitHub Pages部署..."

# 检查是否在git仓库中
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
fi

# 检查是否有远程仓库
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  请先添加GitHub远程仓库："
    echo "   git remote add origin https://github.com/您的用户名/script-assistant.git"
    echo ""
    read -p "请输入您的GitHub用户名: " username
    read -p "请输入仓库名称 (默认: script-assistant): " repo_name
    repo_name=${repo_name:-script-assistant}
    
    echo "🔗 添加远程仓库..."
    git remote add origin "https://github.com/$username/$repo_name.git"
fi

# 添加所有文件
echo "📁 添加文件到Git..."
git add .

# 检查是否有更改
if git diff --staged --quiet; then
    echo "ℹ️  没有检测到更改，跳过提交"
else
    # 提交更改
    echo "💾 提交更改..."
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push origin main

echo ""
echo "✅ 代码已推送到GitHub！"
echo ""
echo "📋 接下来的步骤："
echo "1. 访问您的GitHub仓库页面"
echo "2. 进入 Settings > Pages"
echo "3. 在 Source 部分选择 'GitHub Actions'"
echo "4. 等待自动部署完成"
echo ""
echo "🌐 部署完成后，您的应用将在以下地址可用："
echo "   https://$(git remote get-url origin | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')"
echo ""
echo "⏳ 部署通常需要2-5分钟，请耐心等待..."
