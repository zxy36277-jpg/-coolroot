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

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
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
    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ 
        success: false, 
        error: '会话不存在' 
      });
      return;
    }

    // 生成导出内容
    const exportContent = generateExportContent(session.scripts || []);

    // 设置响应头为文件下载
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="scripts_${sessionId}.txt"`);
    
    res.status(200).send(exportContent);

  } catch (error) {
    console.error('导出错误:', error);
    res.status(500).json({ 
      success: false, 
      error: '导出失败' 
    });
  }
}

function generateExportContent(scripts: any[]): string {
  let content = '脚本文案导出\n';
  content += '='.repeat(50) + '\n\n';
  
  scripts.forEach((script, index) => {
    content += `${index + 1}. ${script.title}\n`;
    content += `类型: ${script.type}\n`;
    content += `时长: ${script.duration}秒\n`;
    content += `创建时间: ${script.createdAt}\n`;
    content += '-'.repeat(30) + '\n';
    content += script.content + '\n\n';
  });
  
  return content;
}
