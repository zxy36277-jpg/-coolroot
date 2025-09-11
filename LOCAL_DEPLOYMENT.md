# 脚本文案助手 - 本地部署说明

## 🚀 部署状态

✅ **部署成功！** 应用已在本地5119端口运行

## 📱 访问地址

### 本地访问
- **前端界面**: http://localhost:5119
- **后端API**: http://localhost:5119/api
- **健康检查**: http://localhost:5119/api/health

### 网络访问
- **GitHub Pages**: https://zxy36277-jpg.github.io/-coolroot

## 🔧 部署步骤

### 1. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装客户端依赖
cd client && npm install
```

### 2. 构建项目
```bash
# 构建服务器
npm run build:server

# 构建客户端
cd client && npm run build
```

### 3. 启动服务
```bash
# 启动服务器（统一端口5119）
npm start
```

## 🧪 功能测试

### ✅ 已测试功能
1. **服务器启动** - 端口5119正常监听
2. **前端访问** - 静态文件服务正常
3. **API健康检查** - `/api/health` 返回正常
4. **文件上传** - `/api/upload` 功能正常
5. **脚本生成** - `/api/generate` 功能正常
6. **会话管理** - `/api/sessions` 功能正常

### 📊 测试结果
- **文件上传测试**: ✅ 成功解析产品信息
- **脚本生成测试**: ✅ 成功生成6种类型脚本
  - 问题解决型 (problem_solution)
  - 产品展示型 (product_showcase) 
  - 故事叙述型 (story_telling)
  - 对比分析型 (comparison)
  - 教程指导型 (tutorial)
  - 用户见证型 (testimonial)

## 🛠️ 技术架构

### 后端服务
- **框架**: Express.js
- **端口**: 5119
- **数据库**: SQLite3
- **文件处理**: Multer
- **AI服务**: DeepSeek API

### 前端应用
- **框架**: React + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand

### 统一部署
- 服务器在5119端口同时提供：
  - 前端静态文件服务
  - 后端API服务
  - 单页应用路由支持

## 📝 使用说明

1. **访问应用**: 打开 http://localhost:5119
2. **上传文件**: 支持.txt, .doc, .docx, .pdf格式
3. **生成脚本**: 选择模板类型，自动生成6种脚本
4. **查看结果**: 在界面中查看生成的脚本内容

## 🔍 故障排除

### 常见问题
1. **端口占用**: 确保5119端口未被占用
2. **依赖缺失**: 运行 `npm install` 安装所有依赖
3. **构建失败**: 检查TypeScript编译错误
4. **文件上传失败**: 检查uploads目录权限

### 重启服务
```bash
# 停止服务
pkill -f "node dist/server.js"

# 重新启动
npm start
```

## 📈 性能指标

- **启动时间**: < 3秒
- **文件上传**: 支持10MB以内文件
- **脚本生成**: 6种模板并行生成
- **响应时间**: API响应 < 1秒

---

**部署完成时间**: 2025-09-10 21:40
**服务状态**: ✅ 正常运行
**访问地址**: http://localhost:5119
