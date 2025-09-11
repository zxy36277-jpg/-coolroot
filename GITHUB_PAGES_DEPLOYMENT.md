# 🚀 GitHub Pages 部署指南

## 📋 部署步骤

### 1. 准备GitHub仓库
```bash
# 如果还没有GitHub仓库，请先创建
# 1. 访问 https://github.com/new
# 2. 创建新仓库，命名为 "script-assistant" 或您喜欢的名称
# 3. 不要初始化README、.gitignore或license（我们已经有了）
```

### 2. 推送代码到GitHub
```bash
# 初始化git仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/您的用户名/script-assistant.git

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: 脚本文案助手"

# 推送到GitHub
git push -u origin main
```

### 3. 启用GitHub Pages
1. 进入您的GitHub仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 4. 自动部署
- 推送代码后，GitHub Actions会自动开始构建和部署
- 您可以在 **Actions** 标签中查看部署进度
- 部署完成后，您的应用将在以下地址可用：
  ```
  https://您的用户名.github.io/script-assistant
  ```

## 🔧 配置说明

### GitHub Actions工作流特性
- ✅ 自动构建React应用
- ✅ 使用最新的GitHub Actions版本
- ✅ 支持手动触发部署
- ✅ 并发控制，避免冲突
- ✅ 权限配置完整

### 构建过程
1. **检出代码** - 获取最新代码
2. **设置Node.js** - 使用Node.js 18
3. **安装依赖** - 使用npm ci快速安装
4. **构建项目** - 运行npm run build
5. **部署到Pages** - 自动部署到GitHub Pages

## 🌐 访问地址

部署成功后，您的应用将在以下地址可用：
```
https://您的用户名.github.io/script-assistant
```

## 📱 功能特性

- ✅ 响应式设计，支持移动端
- ✅ 文件上传和解析
- ✅ 智能文案生成
- ✅ 品牌识别
- ✅ 实时预览

## 🔄 更新部署

每次您推送代码到main分支时，GitHub Actions会自动：
1. 检测到代码变更
2. 重新构建应用
3. 部署到GitHub Pages
4. 更新在线版本

## 🛠️ 故障排除

### 常见问题

1. **部署失败**
   - 检查Actions标签中的错误信息
   - 确保package.json中的构建脚本正确
   - 检查Node.js版本兼容性

2. **页面无法访问**
   - 确认GitHub Pages已启用
   - 检查仓库设置中的Pages配置
   - 等待几分钟让DNS生效

3. **构建错误**
   - 检查client目录下的依赖
   - 运行本地构建测试：`cd client && npm run build`

### 手动触发部署
如果需要手动触发部署：
1. 进入仓库的Actions标签
2. 选择"Deploy to GitHub Pages"工作流
3. 点击"Run workflow"按钮

## 📊 部署状态

您可以在以下位置查看部署状态：
- **Actions标签**: 查看构建日志
- **Pages设置**: 查看部署状态
- **仓库首页**: 查看最新提交

## 🎉 完成！

恭喜！您的脚本文案助手现在已经成功部署到GitHub Pages了！

---

**需要帮助？** 如果遇到任何问题，请检查GitHub Actions的日志或联系技术支持。
