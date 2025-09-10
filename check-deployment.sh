#!/bin/bash

echo "🔍 检查GitHub Pages部署状态..."
echo ""

# 检查GitHub Actions状态
echo "📊 GitHub Actions状态："
curl -s "https://api.github.com/repos/zxy36277-jpg/-coolroot/actions/runs" | jq -r '.workflow_runs[0] | "状态: \(.status) | 结论: \(.conclusion // "进行中") | 分支: \(.head_branch) | SHA: \(.head_sha[0:7])"'

echo ""
echo "🌐 网站访问测试："
if curl -s -o /dev/null -w "%{http_code}" "https://zxy36277-jpg.github.io/-coolroot/" | grep -q "200"; then
    echo "✅ 网站可正常访问！"
    echo "🔗 访问地址: https://zxy36277-jpg.github.io/-coolroot/"
else
    echo "❌ 网站暂时无法访问，可能正在部署中..."
    echo "⏳ 请等待几分钟后重试"
fi

echo ""
echo "📋 部署检查清单："
echo "1. ✅ 修复了GitHub Actions工作流分支名称"
echo "2. ✅ 修复了Vite构建配置的base路径"
echo "3. ✅ 确保资源路径适配GitHub Pages"
echo "4. ⏳ 等待GitHub Actions完成部署"
echo "5. ⏳ 等待GitHub Pages生效（通常需要1-5分钟）"