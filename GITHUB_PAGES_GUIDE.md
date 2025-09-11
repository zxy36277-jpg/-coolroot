# 🚀 GitHub Pages 部署指南

## 📋 部署步骤

### 1. 创建GitHub仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `脚本文案助手` 或 `script-assistant`
   - **Description**: `短视频电商运营脚本助手 - AI智能生成爆款脚本`
   - **Visibility**: Public（GitHub Pages需要公开仓库）
   - **不要**勾选 "Add a README file"（我们已有文件）

### 2. 推送代码到GitHub

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "feat: 添加GitHub Pages部署配置"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/脚本文案助手.git

# 推送到GitHub
git push -u origin master
```

### 3. 配置GitHub Pages

1. 进入你的GitHub仓库页面
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分：
   - 选择 "GitHub Actions"
5. 保存设置

### 4. 自动部署

- 每次推送到 `master` 分支时，GitHub Actions会自动：
  - 安装依赖
  - 构建项目
  - 部署到GitHub Pages

## 🌐 访问你的应用

部署完成后，你的应用将在以下地址可用：
```
https://你的用户名.github.io/脚本文案助手/
```

## ⚙️ 高级配置

### 自定义域名（可选）

1. 在仓库根目录创建 `CNAME` 文件：
```bash
echo "your-domain.com" > CNAME
```

2. 在GitHub Pages设置中配置自定义域名

### 环境变量

如果需要环境变量，在仓库设置中添加：
- Settings → Secrets and variables → Actions
- 添加必要的环境变量

## 🔧 故障排除

### 常见问题

1. **构建失败**
   - 检查 `package.json` 中的依赖
   - 确保所有文件都已提交

2. **页面无法访问**
   - 等待几分钟让GitHub Pages生效
   - 检查仓库是否为公开状态

3. **样式或资源加载失败**
   - 检查 `vite.config.ts` 中的 `base` 配置
   - 确保资源路径正确

### 查看部署状态

1. 进入仓库页面
2. 点击 "Actions" 标签
3. 查看最新的部署状态

## 📱 功能特性

部署后的应用包含：

- ✅ **文件上传解析**：支持TXT、PDF、DOCX
- ✅ **AI智能提取**：自动识别产品信息
- ✅ **脚本生成**：专业短视频脚本
- ✅ **多平台支持**：抖音、快手、小红书、B站
- ✅ **响应式设计**：完美适配移动端

## 🎯 使用流程

1. 访问部署的应用
2. 上传产品信息文件
3. AI自动解析并提取信息
4. 填写补充信息
5. 生成专业脚本
6. 导出使用

## 📞 技术支持

如果遇到问题：

1. 检查GitHub Actions日志
2. 查看浏览器控制台错误
3. 确认所有文件已正确提交
4. 验证GitHub Pages设置

---

**让AI助力您的短视频创作！** 🎬✨
