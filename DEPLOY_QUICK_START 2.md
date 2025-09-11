# 🚀 快速部署指南

## 一键部署

运行快速部署脚本：
```bash
./quick-deploy.sh
```

## 手动部署步骤

### 1. 推送到GitHub

```bash
# 添加远程仓库（如果还没有）
git remote add origin https://github.com/yourusername/script-assistant.git

# 推送代码
git push -u origin main
```

### 2. 部署到Vercel（推荐）

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel --prod
```

### 3. 配置环境变量

在部署平台的控制台中添加：
- `OPENAI_API_KEY`: 您的OpenAI API密钥

## 部署选项对比

| 平台 | 前端 | 后端 | 难度 | 推荐度 |
|------|------|------|------|--------|
| Vercel | ✅ | ✅ | 简单 | ⭐⭐⭐⭐⭐ |
| Netlify | ✅ | ✅ | 简单 | ⭐⭐⭐⭐ |
| GitHub Pages | ✅ | ❌ | 中等 | ⭐⭐⭐ |
| Railway | ✅ | ✅ | 中等 | ⭐⭐⭐⭐ |

## 常见问题

**Q: 部署后无法访问API？**
A: 检查环境变量配置和API基础URL设置。

**Q: OpenAI API调用失败？**
A: 确认API密钥已正确配置且有效。

**Q: 静态资源加载失败？**
A: 检查构建输出目录和服务器配置。

## 获取帮助

- 📖 详细指南: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 问题反馈: 创建GitHub Issue
- 💬 技术支持: 查看README.md
