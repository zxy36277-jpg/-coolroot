# 🚀 短视频电商运营脚本助手 - 部署指南

## 📋 项目概述

这是一个AI驱动的短视频脚本生成助手，专为电商运营人员设计。应用具有以下核心功能：

- ✅ **智能文件解析**：支持TXT、PDF、DOCX文件上传和AI解析
- ✅ **产品信息提取**：自动识别品牌、卖点、行业、目标人群等
- ✅ **脚本生成**：基于产品信息生成专业的短视频脚本
- ✅ **多平台适配**：支持抖音、快手、小红书、B站等平台
- ✅ **响应式设计**：完美适配桌面和移动设备

## 🌐 在线访问

### 方式一：GitHub Pages（推荐）
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择部署分支（通常是main或gh-pages）
4. 访问：`https://你的用户名.github.io/仓库名`

### 方式二：Netlify（简单快速）
1. 访问 [Netlify](https://netlify.com)
2. 连接GitHub仓库
3. 设置构建命令：`cd client && npm install && npm run build`
4. 设置发布目录：`client/dist`
5. 自动部署完成

### 方式三：Vercel
1. 访问 [Vercel](https://vercel.com)
2. 导入GitHub项目
3. 自动检测配置并部署

## 🔧 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤
```bash
# 克隆项目
git clone <仓库地址>
cd 脚本文案助手

# 安装依赖
cd client
npm install

# 启动开发服务器
npm run dev
```

### 访问地址
- 前端：http://localhost:5173
- 后端：http://localhost:5119

## 📱 功能特性

### 1. 文件上传与解析
- 支持多种文件格式：TXT、PDF、DOCX
- AI智能解析产品信息
- 实时显示解析进度和结果

### 2. 产品信息管理
- 品牌名称识别
- 核心卖点提取
- 行业分类判断
- 目标人群分析
- 营销目的识别

### 3. 脚本生成
- 基于产品信息生成专业脚本
- 包含钩子、内容、拍摄指南、性能指标
- 支持多平台适配

### 4. 用户体验优化
- 响应式设计
- 加载状态提示
- 错误处理和用户反馈
- 流畅的动画效果

## 🎯 使用场景

### 电商运营
- 产品推广视频脚本
- 直播带货脚本
- 品牌宣传内容

### 内容创作
- 短视频内容规划
- 营销文案生成
- 多平台内容适配

### 营销团队
- 快速生成营销脚本
- 统一品牌调性
- 提高内容创作效率

## 🔒 生产环境说明

### 模拟数据模式
在生产环境中，应用使用模拟数据来演示功能：

- **文件上传**：模拟AI解析过程（2秒延迟）
- **脚本生成**：返回预设的高质量脚本模板
- **产品信息**：提供示例数据展示功能

### 真实API集成
如需使用真实AI API，需要：

1. 配置API密钥
2. 修改 `client/src/services/api.ts`
3. 设置 `API_BASE_URL` 为真实后端地址

## 📊 技术栈

### 前端
- **React 18**：现代化UI框架
- **TypeScript**：类型安全
- **Tailwind CSS**：快速样式开发
- **Vite**：快速构建工具
- **Zustand**：状态管理

### 后端（可选）
- **Node.js**：服务器运行环境
- **Express**：Web框架
- **SQLite**：轻量级数据库
- **Multer**：文件上传处理

### 部署平台
- **Vercel**：全栈应用部署
- **Netlify**：静态网站部署
- **GitHub Pages**：免费静态托管

## 🚀 快速部署

### 一键部署到Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/你的用户名/脚本文案助手)

### 一键部署到Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/脚本文案助手)

## 📞 支持与反馈

如果您在使用过程中遇到问题或有改进建议，请：

1. 提交Issue到GitHub仓库
2. 发送邮件到：your-email@example.com
3. 加入讨论群：群号

## 📄 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**让AI助力您的短视频创作，提升电商运营效率！** 🎬✨
