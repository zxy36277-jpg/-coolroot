# 部署指南

本指南将帮助您将脚本文案助手部署到不同的平台。

## 部署选项

### 1. GitHub Pages (推荐用于静态前端)

GitHub Pages 适合部署前端应用，但需要单独部署后端API。

#### 步骤：

1. **创建GitHub仓库**
   ```bash
   # 在GitHub上创建新仓库，然后推送代码
   git remote add origin https://github.com/yourusername/script-assistant.git
   git branch -M main
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库设置 → Pages
   - 选择 "GitHub Actions" 作为源
   - 工作流会自动部署到 `gh-pages` 分支

3. **配置环境变量**
   - 在仓库设置中添加 Secrets（至少选择一个）：
     - `OPENAI_API_KEY`: 您的OpenAI API密钥（推荐，效果最佳）
     - `DASHSCOPE_API_KEY`: 通义千问API密钥（推荐新手，有免费额度）
     - `BAIDU_API_KEY`: 文心一言API密钥
     - `ZHIPU_API_KEY`: 智谱AI API密钥
   
   **详细获取指南**：
   - 通义千问（推荐新手）：查看 `GET_DASHSCOPE_KEY.md`
   - 其他方案：查看 `API_ALTERNATIVES.md`

### 2. Vercel (推荐用于全栈应用)

Vercel 支持全栈应用部署，包括前端和后端API。

#### 步骤：

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel --prod
   ```

4. **配置环境变量**
   - 在Vercel控制台中添加环境变量：
     - `OPENAI_API_KEY`: 您的OpenAI API密钥
     - `NODE_ENV`: production

### 3. Netlify

Netlify 也支持全栈应用部署。

#### 步骤：

1. **连接GitHub仓库**
   - 登录Netlify
   - 选择 "New site from Git"
   - 连接您的GitHub仓库

2. **配置构建设置**
   - Build command: `npm run build && cd client && npm run build`
   - Publish directory: `client/dist`

3. **配置环境变量**
   - 在Site settings → Environment variables中添加：
     - `OPENAI_API_KEY`: 您的OpenAI API密钥

### 4. Railway

Railway 是一个现代的云平台，支持Node.js应用。

#### 步骤：

1. **连接GitHub仓库**
   - 登录Railway
   - 选择 "Deploy from GitHub repo"
   - 选择您的仓库

2. **配置环境变量**
   - 在项目设置中添加：
     - `OPENAI_API_KEY`: 您的OpenAI API密钥
     - `NODE_ENV`: production

## 环境变量配置

无论选择哪种部署方式，都需要配置以下环境变量：

```env
# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key_here

# 服务器配置
PORT=5119
NODE_ENV=production

# 数据库配置
DATABASE_URL=./database.sqlite
```

## 部署前检查清单

- [ ] 确保所有依赖已安装
- [ ] 前端构建成功 (`npm run build`)
- [ ] 后端构建成功 (`npm run build:server`)
- [ ] 配置了必要的环境变量
- [ ] 测试了本地功能
- [ ] 更新了API配置以适配部署环境

## 常见问题

### Q: 部署后API请求失败
A: 检查API基础URL配置，确保生产环境使用正确的API端点。

### Q: OpenAI API调用失败
A: 确认环境变量 `OPENAI_API_KEY` 已正确配置。

### Q: 静态资源加载失败
A: 检查构建输出目录和服务器配置。

### Q: 数据库连接问题
A: 确认数据库文件路径和权限设置。

## 性能优化建议

1. **启用Gzip压缩**
2. **配置CDN加速**
3. **优化图片资源**
4. **启用浏览器缓存**
5. **使用HTTP/2**

## 监控和日志

建议配置以下监控：

1. **应用性能监控 (APM)**
2. **错误追踪**
3. **用户行为分析**
4. **服务器资源监控**

## 备份策略

1. **代码备份**: 使用Git版本控制
2. **数据库备份**: 定期备份SQLite文件
3. **环境配置备份**: 保存环境变量配置

## 安全考虑

1. **API密钥安全**: 不要在代码中硬编码API密钥
2. **HTTPS**: 确保生产环境使用HTTPS
3. **CORS配置**: 正确配置跨域请求
4. **输入验证**: 验证所有用户输入
5. **速率限制**: 实施API调用频率限制
