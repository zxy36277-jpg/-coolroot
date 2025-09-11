# Vercel 部署指南

## 🚀 快速部署到Vercel

### 1. 准备工作
确保您已经：
- 创建了Vercel账户
- 安装了Vercel CLI
- 项目已经推送到GitHub

### 2. 安装Vercel CLI
```bash
npm install -g vercel
```

### 3. 登录Vercel
```bash
vercel login
```

### 4. 部署项目
```bash
# 在项目根目录执行
vercel --prod
```

### 5. 配置环境变量
在Vercel控制台中设置以下环境变量：
- `NODE_ENV=production`

### 6. 验证部署
部署完成后，您将获得一个URL，例如：
- `https://video-script-assistant.vercel.app`

### 7. 测试API端点
```bash
# 测试健康检查
curl https://video-script-assistant.vercel.app/api/scripts/health

# 测试创建会话
curl -X POST https://video-script-assistant.vercel.app/api/scripts/sessions

# 测试文件上传
curl -X POST -F "file=@test_upload.txt" https://video-script-assistant.vercel.app/api/scripts/upload
```

## 🔧 故障排除

### 常见问题

1. **部署失败**
   - 检查package.json中的依赖
   - 确保所有必要的文件都已提交

2. **API不工作**
   - 检查vercel.json配置
   - 确认API路由配置正确

3. **CORS错误**
   - 检查API中的CORS设置
   - 确认允许的域名配置

## 📝 注意事项

- Vercel免费版有函数执行时间限制
- 文件上传功能使用模拟数据
- 数据库使用内存存储，重启后会丢失数据

## 🔄 更新部署

每次代码更新后，重新运行：
```bash
vercel --prod
```

或者配置自动部署，每次推送到GitHub主分支时自动部署。
