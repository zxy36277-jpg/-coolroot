#!/bin/bash

echo "🔍 检查部署状态"
echo "=================="

# 检查GitHub仓库状态
echo "📋 GitHub仓库信息："
echo "   仓库地址: https://github.com/zxy36277-jpg/-coolroot"
echo "   分支: master"
echo ""

# 检查GitHub Actions状态
echo "🚀 GitHub Actions状态："
echo "   访问: https://github.com/zxy36277-jpg/-coolroot/actions"
echo "   如果看到绿色勾号，说明部署成功"
echo ""

# 检查GitHub Pages状态
echo "🌐 GitHub Pages状态："
echo "   访问: https://zxy36277-jpg.github.io/-coolroot"
echo "   如果页面正常显示，说明部署完成"
echo ""

# 检查环境变量配置
echo "⚙️  环境变量配置："
echo "   需要在GitHub仓库设置中添加："
echo "   - OPENAI_API_KEY: 您的OpenAI API密钥"
echo "   配置路径: Settings → Secrets and variables → Actions"
echo ""

# 提供下一步操作指南
echo "📝 下一步操作："
echo "   1. 访问 https://github.com/zxy36277-jpg/-coolroot/settings/pages"
echo "   2. 启用GitHub Pages，选择 'GitHub Actions' 作为源"
echo "   3. 在仓库设置中添加 OPENAI_API_KEY 环境变量"
echo "   4. 等待GitHub Actions自动部署完成"
echo "   5. 访问 https://zxy36277-jpg.github.io/-coolroot 查看应用"
echo ""

echo "✅ 部署检查完成！"
