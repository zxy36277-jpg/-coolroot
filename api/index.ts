import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();

// 中间件配置
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 内存存储配置
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式，请上传txt、pdf、docx或doc文件'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '脚本文案助手API运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 文件上传和AI解析端点
app.post('/api/scripts/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '请选择要上传的文件' });
    }

    // 模拟AI解析结果
    const mockResult = {
      brandName: 'FineNutri斐萃',
      sellingPoints: ['6000倍抗氧化力的麦角硫因核心成分', '内外双抗抗垂抗纹', '三甲医院真实人体实验验证效果'],
      promotionInfo: '无明确优惠信息',
      industry: '保健品',
      targetAudience: '25-40岁都市女性、职场精英、精致妈妈',
      videoPurpose: '产品推广',
      platforms: ['抖音', '小红书', '淘宝'],
      forbiddenWords: '治愈, 治疗'
    };

    res.json({
      success: true,
      data: {
        content: req.file.buffer.toString('utf-8'),
        extractedInfo: mockResult
      }
    });

  } catch (error) {
    console.error('上传处理错误:', error);
    res.status(500).json({ 
      success: false, 
      error: '服务器内部错误，请稍后重试' 
    });
  }
});

// 创建会话端点
app.post('/api/scripts/sessions', (req, res) => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.json({
    success: true,
    data: { sessionId }
  });
});

// 生成脚本端点
app.post('/api/scripts/generate', (req, res) => {
  const { sessionId, productInfo } = req.body;
  
  if (!sessionId || !productInfo) {
    return res.status(400).json({ 
      success: false, 
      error: '缺少必要参数' 
    });
  }

  // 模拟脚本生成
  const mockScript = {
    title: `${productInfo.brandName} - 专业产品推广脚本`,
    content: `【开场白】
大家好！今天给大家推荐一款${productInfo.industry}产品 - ${productInfo.brandName}。

【产品介绍】
${productInfo.sellingPoints.join('，')}。

【目标用户】
特别适合${productInfo.targetAudience}使用。

【平台适配】
本脚本适用于${productInfo.platforms.join('、')}等平台。

【注意事项】
避免使用以下词汇：${productInfo.forbiddenWords}。`,
    metrics: {
      estimatedViews: '10K-50K',
      expectedCTR: '3-8%',
      targetARPU: '¥50-200'
    }
  };

  res.json({
    success: true,
    data: mockScript
  });
});

// 处理所有其他路由
app.get('*', (req, res) => {
  res.json({ 
    message: '脚本文案助手API',
    endpoints: [
      'GET /api/health - 健康检查',
      'POST /api/scripts/upload - 文件上传',
      'POST /api/scripts/sessions - 创建会话',
      'POST /api/scripts/generate - 生成脚本'
    ]
  });
});

export default app;