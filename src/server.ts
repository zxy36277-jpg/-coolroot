import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/config';
import { initDatabase } from './database/database';
import scriptRoutes from './routes/scriptRoutes';

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API路由（必须在静态文件服务之前）
app.use('/api/scripts', scriptRoutes);

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 静态文件服务（在API路由之后）
app.use(express.static(path.join(__dirname, '../client/dist')));

// 前端路由处理（SPA支持）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: '文件大小超过限制（10MB）'
    });
  }
  
  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 初始化数据库
    await initDatabase();
    
    app.listen(config.port, () => {
      console.log(`🚀 服务器启动成功！`);
      console.log(`📱 本地访问: http://localhost:${config.port}`);
      console.log(`🌐 网络访问: http://192.168.1.24:${config.port}`);
      console.log(`📊 API文档: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();
