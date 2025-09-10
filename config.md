# 配置说明

## 环境变量配置

创建 `.env` 文件，包含以下配置：

```env
# DeepSeek API配置
DEEPSEEK_API_KEY=sk-295761577e304806a3c5c17b0064d11c
DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions

# 服务器配置
PORT=5119
NODE_ENV=development

# 数据库配置
DATABASE_PATH=./data/script_assistant.db
```

## 启动方式

### 开发模式
```bash
./dev.sh
```

### 生产模式
```bash
./start.sh
```

### 手动启动
```bash
# 安装依赖
npm install
cd client && npm install && cd ..

# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 访问地址

- 本地访问: http://localhost:5119
- 网络访问: http://192.168.1.24:5119
