import { VercelRequest, VercelResponse } from '@vercel/node';

// 简单的UUID生成函数
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 内存存储（生产环境建议使用数据库）
const sessions = new Map<string, any>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // 创建新会话
    const sessionId = generateUUID();
    sessions.set(sessionId, {
      id: sessionId,
      createdAt: new Date().toISOString(),
      scripts: []
    });

    res.status(200).json({
      success: true,
      data: { sessionId }
    });
    return;
  }

  if (req.method === 'GET') {
    // 获取会话列表
    const sessionList = Array.from(sessions.values());
    res.status(200).json({
      success: true,
      data: sessionList
    });
    return;
  }

  res.status(405).json({ success: false, error: 'Method not allowed' });
}
