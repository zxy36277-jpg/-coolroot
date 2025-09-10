# 🚀 部署指南

## 问题说明
GitHub Pages只能托管静态文件，无法运行后端服务器。需要将后端部署到云服务器上。

## 解决方案

### 方案1：Vercel部署（推荐）

#### 步骤1：准备部署文件
```bash
# 确保所有文件都已准备好
npm install
```

#### 步骤2：部署到Vercel
1. 访问 [Vercel官网](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"New Project"
4. 选择您的GitHub仓库
5. 配置项目：
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

#### 步骤3：配置环境变量
在Vercel项目设置中添加：
- `NODE_ENV=production`

#### 步骤4：更新前端配置
部署完成后，Vercel会提供一个URL，例如：`https://your-project.vercel.app`

更新 `client/src/services/api.ts` 中的API地址：
```typescript
return 'https://your-project.vercel.app/api';
```

### 方案2：Railway部署

#### 步骤1：准备部署
```bash
npm install
npm run build:server
```

#### 步骤2：部署到Railway
1. 访问 [Railway官网](https://railway.app)
2. 使用GitHub账号登录
3. 点击"New Project" -> "Deploy from GitHub repo"
4. 选择您的仓库
5. Railway会自动检测并部署

### 方案3：Render部署

#### 步骤1：准备部署
```bash
npm install
npm run build:server
```

#### 步骤2：部署到Render
1. 访问 [Render官网](https://render.com)
2. 使用GitHub账号登录
3. 点击"New" -> "Web Service"
4. 连接GitHub仓库
5. 配置：
   - Build Command: `npm install && npm run build:client && npm run build:server`
   - Start Command: `npm start`

## 部署后测试

### 1. 测试API健康检查
```bash
curl https://your-deployed-api.com/api/health
```

### 2. 测试文件上传
```bash
curl -X POST -F "file=@test.txt" https://your-deployed-api.com/api/upload
```

### 3. 测试前端连接
访问GitHub Pages，测试文件上传功能是否正常。

## 常见问题

### Q: 部署后API无法访问？
A: 检查CORS配置，确保允许GitHub Pages域名访问。

### Q: 文件上传失败？
A: 检查文件大小限制和文件类型支持。

### Q: 数据库连接问题？
A: 云服务器可能需要使用外部数据库服务，如PlanetScale或Supabase。

## 推荐配置

### 环境变量
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-username.github.io
```

### 数据库
考虑使用外部数据库服务：
- PlanetScale (MySQL)
- Supabase (PostgreSQL)
- MongoDB Atlas

## 成本估算
- Vercel: 免费额度充足
- Railway: 免费额度充足
- Render: 免费额度充足

所有方案都有免费额度，适合个人项目使用。