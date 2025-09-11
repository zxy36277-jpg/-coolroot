# 🚀 脚本文案助手 - 部署指南

本项目提供多种部署方案，您可以根据自己的需求选择最适合的方式。

## 📋 部署方案对比

| 方案 | 难度 | 成本 | 功能 | 推荐指数 |
|------|------|------|------|----------|
| Vercel | ⭐⭐ | 免费 | 完整 | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ⭐ | 免费 | 静态 | ⭐⭐⭐⭐ |
| Netlify | ⭐⭐ | 免费 | 完整 | ⭐⭐⭐⭐ |
| Docker | ⭐⭐⭐ | 服务器费用 | 完整 | ⭐⭐⭐ |
| 静态托管 | ⭐ | 免费/低费用 | 静态 | ⭐⭐⭐ |

## 🎯 方案1: Vercel部署（推荐）

### 优势
- ✅ 免费额度充足
- ✅ 自动部署
- ✅ 全球CDN
- ✅ 支持API函数
- ✅ 自定义域名

### 部署步骤
1. 确保已修复vercel.json配置
2. 运行部署命令：
```bash
npx vercel --prod
```
3. 访问生成的URL

### 访问地址
- 生产环境: https://script-assistant-nine.vercel.app
- 测试页面: https://script-assistant-nine.vercel.app/test.html

---

## 🎯 方案2: GitHub Pages部署

### 优势
- ✅ 完全免费
- ✅ 自动部署
- ✅ 版本控制
- ✅ 简单易用

### 部署步骤
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择"GitHub Actions"作为部署源
4. 推送代码后自动部署

### 访问地址
- 格式: `https://yourusername.github.io/script-assistant`

---

## 🎯 方案3: Netlify部署

### 优势
- ✅ 免费额度
- ✅ 拖拽部署
- ✅ 表单处理
- ✅ 分支预览

### 部署步骤
1. 访问 [netlify.com](https://netlify.com)
2. 连接GitHub仓库或拖拽dist文件夹
3. 配置构建设置：
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
4. 部署完成

---

## 🎯 方案4: Docker部署

### 优势
- ✅ 环境一致
- ✅ 易于扩展
- ✅ 支持集群
- ✅ 生产就绪

### 部署步骤
1. 构建Docker镜像：
```bash
docker build -t script-assistant .
```

2. 运行容器：
```bash
docker run -p 3000:80 script-assistant
```

3. 或使用docker-compose：
```bash
docker-compose up -d
```

### 访问地址
- 本地: http://localhost:3000
- 服务器: http://your-server-ip:3000

---

## 🎯 方案5: 静态文件托管

### 优势
- ✅ 成本最低
- ✅ 部署简单
- ✅ 性能优秀
- ✅ 支持CDN

### 部署步骤
1. 运行构建脚本：
```bash
./deploy-static.sh
```

2. 将生成的`script-assistant-static.tar.gz`上传到任意静态托管平台

### 支持的平台
- 阿里云OSS
- 腾讯云COS
- 七牛云
- 又拍云
- 自建服务器

---

## 🔧 环境要求

### 开发环境
- Node.js 18+
- npm 8+

### 生产环境
- 现代浏览器支持
- HTTPS（推荐）

## 📱 移动端支持

所有部署方案都支持移动端访问，应用采用响应式设计。

## 🔒 安全考虑

- 所有API请求都经过CORS配置
- 文件上传有大小限制
- 支持HTTPS部署

## 🚀 快速开始

选择您喜欢的部署方案，按照对应步骤操作即可。推荐从Vercel开始，因为它最简单且功能完整。

## 📞 技术支持

如果在部署过程中遇到问题，请检查：
1. Node.js版本是否正确
2. 依赖是否安装完整
3. 构建是否成功
4. 网络连接是否正常

---

**祝您部署顺利！** 🎉