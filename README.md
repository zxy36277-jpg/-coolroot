# 脚本文案助手

一个智能的视频脚本文案生成工具，支持多种模板和AI驱动的文案创作。

## 功能特性

- 🎬 多种脚本模板（产品展示、故事叙述、对比评测、教程指南、用户证言、问题解决）
- 🤖 AI驱动的智能文案生成
- 📝 产品信息智能解析
- 🎯 针对不同平台优化（抖音、小红书、B站等）
- 📊 性能指标预测
- 🎨 拍摄指导建议

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Zustand (状态管理)
- Ant Design (UI组件)
- Axios (HTTP客户端)

### 后端
- Node.js
- Express
- TypeScript
- SQLite (数据库)
- OpenAI API (AI文案生成)

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
```

### 环境配置
1. 复制 `.env.example` 为 `.env`
2. 配置必要的环境变量：
   - `OPENAI_API_KEY`: OpenAI API密钥
   - `PORT`: 服务器端口（默认5119）

### 开发模式
```bash
# 启动后端服务
npm run dev:server

# 启动前端开发服务器
npm run dev
```

### 生产构建
```bash
# 构建前端
npm run build

# 构建后端
npm run build:server

# 启动生产服务
npm start
```

## 部署

### GitHub Pages
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择部署分支（通常是gh-pages）

### Vercel部署
1. 连接GitHub仓库到Vercel
2. 配置构建命令和输出目录
3. 部署

## API文档

### 主要接口

#### 上传产品信息
```
POST /api/upload
Content-Type: multipart/form-data

参数：
- file: 产品信息文件（支持txt格式）
```

#### 生成脚本
```
POST /api/scripts/generate
Content-Type: application/json

参数：
{
  "productInfo": {
    "brandName": "品牌名称",
    "sellingPoints": ["卖点1", "卖点2"],
    "promotionInfo": "优惠信息",
    "industry": "行业",
    "targetAudience": "目标人群",
    "videoPurpose": "视频目的",
    "platforms": ["平台1", "平台2"],
    "forbiddenWords": "违禁词"
  },
  "sessionId": "会话ID"
}
```

#### 获取脚本列表
```
GET /api/scripts?sessionId={sessionId}
```

## 项目结构

```
脚本文案助手/
├── public/                 # 静态资源
├── src/                    # 前端源码
│   ├── components/         # React组件
│   ├── pages/             # 页面组件
│   ├── services/          # API服务
│   ├── stores/            # 状态管理
│   └── types/             # TypeScript类型定义
├── server/                # 后端源码
│   ├── src/               # 服务器源码
│   │   ├── controllers/   # 控制器
│   │   ├── services/      # 业务逻辑
│   │   ├── routes/        # 路由
│   │   └── utils/         # 工具函数
│   └── dist/              # 编译输出
├── package.json           # 项目配置
└── README.md             # 项目说明
```

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License