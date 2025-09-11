#!/bin/bash

# 短视频电商运营脚本助手 - 部署脚本
# 支持多种部署平台

echo "🚀 短视频电商运营脚本助手 - 部署脚本"
echo "=================================="

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js版本: $node_version"
else
    echo "❌ 未安装Node.js，请先安装Node.js 18+"
    exit 1
fi

# 构建项目
echo "🔨 构建项目..."
cd client
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 项目构建成功"
else
    echo "❌ 项目构建失败"
    exit 1
fi

cd ..

# 选择部署方式
echo ""
echo "🌐 选择部署方式："
echo "1) GitHub Pages"
echo "2) Netlify"
echo "3) Vercel"
echo "4) 本地预览"
echo ""

read -p "请选择部署方式 (1-4): " choice

case $choice in
    1)
        echo "📤 部署到GitHub Pages..."
        echo ""
        echo "🔧 自动配置GitHub Pages..."
        
        # 检查是否已有GitHub远程仓库
        if git remote get-url origin &> /dev/null; then
            echo "✅ 已配置GitHub远程仓库"
            echo "📤 推送代码到GitHub..."
            git add .
            git commit -m "feat: 添加GitHub Pages部署配置"
            git push origin master
            echo "✅ 代码已推送到GitHub"
        else
            echo "⚠️  未配置GitHub远程仓库"
            echo "请按照以下步骤操作："
            echo "1. 在GitHub创建新仓库"
            echo "2. 运行: git remote add origin https://github.com/你的用户名/仓库名.git"
            echo "3. 运行: git push -u origin master"
        fi
        
        echo ""
        echo "📋 接下来请手动完成："
        echo "1. 进入GitHub仓库页面"
        echo "2. 点击 Settings → Pages"
        echo "3. Source 选择 'GitHub Actions'"
        echo "4. 等待自动部署完成"
        echo "5. 访问: https://你的用户名.github.io/仓库名"
        echo ""
        echo "📖 详细指南: 查看 GITHUB_PAGES_GUIDE.md"
        ;;
    2)
        echo "📤 部署到Netlify..."
        echo "请按照以下步骤操作："
        echo "1. 访问 https://netlify.com"
        echo "2. 连接GitHub仓库"
        echo "3. 设置构建命令: cd client && npm install && npm run build"
        echo "4. 设置发布目录: client/dist"
        echo "5. 点击部署"
        ;;
    3)
        echo "📤 部署到Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "请先安装Vercel CLI: npm install -g vercel"
            echo "然后运行: vercel --prod"
        fi
        ;;
    4)
        echo "🔍 启动本地预览..."
        cd client
        npx serve dist -p 3000
        echo "✅ 本地预览已启动: http://localhost:3000"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo "📱 应用功能："
echo "  - 智能文件解析（TXT/PDF/DOCX）"
echo "  - AI产品信息提取"
echo "  - 专业脚本生成"
echo "  - 多平台适配"
echo "  - 响应式设计"
echo ""
echo "💡 提示：生产环境使用模拟数据演示功能"
echo "🔧 如需真实API，请配置后端服务"