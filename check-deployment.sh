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
echo "   需要在GitHub仓库设置中添加（至少选择一个）："
echo "   - DEEPSEEK_API_KEY: DeepSeek API密钥（**强烈推荐**，性价比最高）"
echo "   - OPENAI_API_KEY: OpenAI API密钥（效果最佳，价格较高）"
echo "   - DASHSCOPE_API_KEY: 通义千问API密钥（推荐新手，有免费额度）"
echo "   - BAIDU_API_KEY: 文心一言API密钥"
echo "   - ZHIPU_API_KEY: 智谱AI API密钥"
echo "   配置路径: Settings → Secrets and variables → Actions"
echo ""
echo "📖 API密钥获取指南："
echo "   - DeepSeek（强烈推荐）：查看 GET_DEEPSEEK_KEY.md"
echo "   - 通义千问（推荐新手）：查看 GET_DASHSCOPE_KEY.md"
echo "   - 其他方案：查看 API_ALTERNATIVES.md"
echo ""

# 提供下一步操作指南
echo "📝 下一步操作："
echo "   1. 访问 https://github.com/zxy36277-jpg/-coolroot/settings/pages"
echo "   2. 启用GitHub Pages，选择 'GitHub Actions' 作为源"
echo "   3. 获取API密钥（推荐DeepSeek，性价比最高）"
echo "   4. 在仓库设置中添加API密钥环境变量"
echo "   5. 等待GitHub Actions自动部署完成"
echo "   6. 访问 https://zxy36277-jpg.github.io/-coolroot 查看应用"
echo ""

echo "✅ 部署检查完成！"
