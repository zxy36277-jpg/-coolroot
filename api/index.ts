import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { uploadHandler, generateScriptsHandler, healthHandler } from '../src/routes';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 文件上传配置
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// 路由
app.get('/api/health', healthHandler);
app.post('/api/upload', upload.single('file'), uploadHandler);
app.post('/api/generate-scripts', generateScriptsHandler);

// Vercel serverless function handler
export default app;
