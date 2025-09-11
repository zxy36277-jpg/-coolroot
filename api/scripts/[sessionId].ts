import { VercelRequest, VercelResponse } from '@vercel/node';

// 内存存储
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

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    res.status(400).json({ 
      success: false, 
      error: '缺少 sessionId 参数' 
    });
    return;
  }

  try {
    if (req.method === 'GET') {
      // 获取会话的脚本列表
      const session = sessions.get(sessionId);
      if (!session) {
        res.status(404).json({ 
          success: false, 
          error: '会话不存在' 
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: session.scripts || []
      });
      return;
    }

    if (req.method === 'POST') {
      // 创建新脚本
      const { title, content, type, duration } = req.body;
      
      if (!title || !content) {
        res.status(400).json({ 
          success: false, 
          error: '缺少必要参数：title 和 content' 
        });
        return;
      }

      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, { id: sessionId, scripts: [] });
      }

      const session = sessions.get(sessionId);
      const newScript = {
        id: Date.now(),
        title,
        content,
        type: type || '自定义',
        duration: duration || 30,
        createdAt: new Date().toISOString()
      };

      session.scripts.push(newScript);

      res.status(200).json({
        success: true,
        data: newScript
      });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (error) {
    console.error('脚本操作错误:', error);
    res.status(500).json({ 
      success: false, 
      error: '操作失败' 
    });
  }
}
