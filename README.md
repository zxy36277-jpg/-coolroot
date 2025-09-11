# 🎬 短视频电商运营脚本助手

> AI驱动的智能脚本生成工具，助力电商运营人员快速创作爆款短视频内容

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)

## ✨ 功能特色

### 🤖 智能文件解析
- 支持多种文件格式：TXT、PDF、DOCX
- AI智能解析产品信息
- 实时显示解析进度和结果
- 自动识别品牌、卖点、行业等关键信息

### 📝 专业脚本生成
- 基于产品信息生成专业脚本
- 包含钩子、内容、拍摄指南、性能指标
- 支持多平台适配（抖音、快手、小红书、B站等）
- 符合各平台内容规范和用户习惯

### 🎯 用户体验优化
- 现代化响应式设计
- 流畅的加载状态提示
- 完善的错误处理和用户反馈
- 支持桌面和移动设备

## 🚀 快速开始

### 在线体验
访问部署版本：[https://your-app.netlify.app](https://your-app.netlify.app)

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd 脚本文案助手

# 安装依赖
cd client
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用

## 📱 使用指南

### 1. 上传产品信息
- 支持拖拽上传或点击选择文件
- 支持TXT、PDF、DOCX格式
- 自动解析并提取关键信息

### 2. 填写产品详情
- 品牌名称
- 核心卖点（最多3个）
- 行业分类
- 目标人群
- 营销目的
- 适配平台
- 优惠信息
- 违禁词

### 3. 生成脚本
- 点击"生成脚本"按钮
- AI自动生成专业脚本
- 包含完整的拍摄指南和性能指标

### 4. 导出使用
- 支持一键导出脚本
- 可直接用于视频制作
- 适配各平台规范

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全开发
- **Tailwind CSS** - 快速样式开发
- **Vite** - 快速构建工具
- **Zustand** - 轻量级状态管理

### 后端技术（可选）
- **Node.js** - 服务器运行环境
- **Express** - Web应用框架
- **SQLite** - 轻量级数据库
- **Multer** - 文件上传处理

### 部署平台
- **Netlify** - 静态网站托管
- **Vercel** - 全栈应用部署
- **GitHub Pages** - 免费静态托管

## 📊 项目结构

```
脚本文案助手/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── services/       # API服务
│   │   ├── store/          # 状态管理
│   │   └── types/          # TypeScript类型
│   ├── public/             # 静态资源
│   └── dist/               # 构建输出
├── api/                    # 后端API（可选）
├── docs/                   # 文档
└── deploy.sh              # 部署脚本
```

## 🌐 部署指南

### 一键部署
```bash
# 运行部署脚本
./deploy.sh
```

### 手动部署

#### Netlify部署
1. 访问 [Netlify](https://netlify.com)
2. 连接GitHub仓库
3. 设置构建命令：`cd client && npm install && npm run build`
4. 设置发布目录：`client/dist`

#### Vercel部署
1. 访问 [Vercel](https://vercel.com)
2. 导入GitHub项目
3. 自动检测配置并部署

#### GitHub Pages部署
1. 在仓库设置中启用GitHub Pages
2. 选择部署分支
3. 访问生成的URL

## 🔧 配置说明

### 环境变量
```bash
# 开发环境
NODE_ENV=development

# 生产环境
NODE_ENV=production
```

### API配置
生产环境默认使用模拟数据，如需真实API：

1. 配置后端服务
2. 修改 `client/src/services/api.ts`
3. 设置正确的API地址

## 📈 功能演示

### 文件上传解析
- 支持拖拽上传
- 实时解析进度
- 智能信息提取

### 脚本生成
- 专业脚本模板
- 多平台适配
- 完整拍摄指南

### 响应式设计
- 桌面端优化
- 移动端适配
- 流畅交互体验

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 📄 许可证

本项目采用 [MIT许可证](LICENSE)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

## 📞 联系我们

- 项目地址：[GitHub Repository](https://github.com/your-username/script-assistant)
- 问题反馈：[Issues](https://github.com/your-username/script-assistant/issues)
- 邮箱：your-email@example.com

---

**让AI助力您的短视频创作，提升电商运营效率！** 🎬✨