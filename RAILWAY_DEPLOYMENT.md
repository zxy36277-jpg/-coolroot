# Railway 部署指南

## 快速部署步骤

### 1. 注册 Railway 账号
- 访问 [railway.app](https://railway.app)
- 使用 GitHub 账号登录

### 2. 连接 GitHub 仓库
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择您的仓库：`zxy36277-jpg/-coolroot`

### 3. 配置部署
- Railway 会自动检测到 `package.json`
- 使用默认配置即可
- 部署时间：约 2-3 分钟

### 4. 获取部署 URL
- 部署完成后，Railway 会提供一个 URL
- 格式类似：`https://your-app-name.railway.app`

### 5. 更新前端配置
将前端 API 配置更新为 Railway URL：
```typescript
// 在 client/src/services/api.ts 中
if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
  return 'https://your-app-name.railway.app/api';
}
```

## 优势
- ✅ 部署速度快（2-3分钟）
- ✅ 免费额度充足
- ✅ 自动 HTTPS
- ✅ 环境变量管理简单
- ✅ 日志查看方便

## 注意事项
- 免费版有使用限制，但足够个人项目使用
- 需要信用卡验证（但不会收费）
- 支持自定义域名

## 故障排除
如果部署失败，检查：
1. `package.json` 中的 `start` 脚本
2. 确保所有依赖都在 `dependencies` 中
3. 检查 `railway.json` 配置
