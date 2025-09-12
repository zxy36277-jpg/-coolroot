#!/bin/bash

# 🚀 脚本文案助手自动启动配置
# 作者: AI Assistant

echo "🔧 配置脚本文案助手自动启动..."
echo "=================================="

# 创建启动器脚本
cat > ~/Desktop/启动脚本文案助手.command << 'EOF'
#!/bin/bash
cd "/Users/xiaoyanzhou/Desktop/claude/脚本文案助手"
./start.sh
EOF

# 设置执行权限
chmod +x ~/Desktop/启动脚本文案助手.command

echo "✅ 已创建桌面启动器: 启动脚本文案助手.command"
echo ""

# 创建后台启动器脚本
cat > ~/Desktop/后台启动脚本文案助手.command << 'EOF'
#!/bin/bash
cd "/Users/xiaoyanzhou/Desktop/claude/脚本文案助手"
./start_background.sh
EOF

# 设置执行权限
chmod +x ~/Desktop/后台启动脚本文案助手.command

echo "✅ 已创建桌面后台启动器: 后台启动脚本文案助手.command"
echo ""

# 创建停止器脚本
cat > ~/Desktop/停止脚本文案助手.command << 'EOF'
#!/bin/bash
cd "/Users/xiaoyanzhou/Desktop/claude/脚本文案助手"
./stop.sh
EOF

# 设置执行权限
chmod +x ~/Desktop/停止脚本文案助手.command

echo "✅ 已创建桌面停止器: 停止脚本文案助手.command"
echo ""

# 创建状态检查器脚本
cat > ~/Desktop/检查脚本文案助手状态.command << 'EOF'
#!/bin/bash
cd "/Users/xiaoyanzhou/Desktop/claude/脚本文案助手"
./status.sh
read -p "按回车键关闭..."
EOF

# 设置执行权限
chmod +x ~/Desktop/检查脚本文案助手状态.command

echo "✅ 已创建桌面状态检查器: 检查脚本文案助手状态.command"
echo ""

echo "🎉 自动启动配置完成！"
echo "=================================="
echo "📱 桌面快捷方式:"
echo "   🚀 启动脚本文案助手.command - 启动服务器"
echo "   🔄 后台启动脚本文案助手.command - 后台启动"
echo "   🛑 停止脚本文案助手.command - 停止服务器"
echo "   📊 检查脚本文案助手状态.command - 查看状态"
echo ""
echo "💡 使用方法:"
echo "   1. 双击桌面上的启动器即可启动"
echo "   2. 服务器启动后会自动打开浏览器"
echo "   3. 使用后台启动器可以让服务器在后台运行"
echo "   4. 需要停止时双击停止器"
echo ""
echo "🌐 访问地址:"
echo "   本地: http://localhost:3000"
echo "   在线: https://zxy36277-jpg.github.io/-coolroot/"
