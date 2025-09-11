import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    res.status(200).json({ 
      success: true, 
      message: 'API测试成功',
      timestamp: new Date().toISOString(),
      method: req.method
    });
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ 
      success: false,
      error: '服务器内部错误' 
    });
  }
}
