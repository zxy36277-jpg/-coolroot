# GitHub Pages 设置指南

## 🚨 重要：需要手动配置GitHub Pages

您的网站目前显示404错误，这是因为需要在GitHub仓库设置中启用GitHub Pages。

## 📋 设置步骤

### 1. 访问仓库设置
1. 打开您的GitHub仓库：https://github.com/zxy36277-jpg/-coolroot
2. 点击 **Settings** 标签页
3. 在左侧菜单中找到 **Pages** 选项

### 2. 配置GitHub Pages
1. 在 **Source** 部分，选择 **Deploy from a branch**
2. 在 **Branch** 下拉菜单中选择 **gh-pages**
3. 在 **Folder** 中选择 **/ (root)**
4. 点击 **Save** 按钮

### 3. 等待部署
- GitHub Pages通常需要1-5分钟来部署
- 部署完成后，您的网站将在以下地址可用：
  - **https://zxy36277-jpg.github.io/-coolroot/**

## ✅ 验证部署

### 检查部署状态
1. 在仓库的 **Actions** 标签页中查看部署状态
2. 在 **Settings > Pages** 中查看部署状态

### 测试网站访问
```bash
# 等待几分钟后测试
curl -I https://zxy36277-jpg.github.io/-coolroot/
```

## 🔧 如果仍然无法访问

### 可能的原因：
1. **GitHub Pages未启用** - 需要按照上述步骤启用
2. **分支选择错误** - 确保选择了 `gh-pages` 分支
3. **部署时间** - 首次部署可能需要更长时间
4. **缓存问题** - 清除浏览器缓存或使用无痕模式

### 解决方案：
1. 确认GitHub Pages设置正确
2. 等待5-10分钟
3. 检查仓库的Actions页面是否有错误
4. 尝试访问：https://zxy36277-jpg.github.io/-coolroot/

## 📞 需要帮助？

如果按照上述步骤仍然无法访问，请：
1. 检查GitHub仓库的Settings > Pages页面
2. 查看是否有任何错误信息
3. 确认gh-pages分支已成功推送

---

**注意**：我已经成功创建了gh-pages分支并推送了所有必要的文件。现在只需要在GitHub仓库设置中启用GitHub Pages即可。
