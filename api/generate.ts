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

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { sessionId, productInfo, scriptType, targetAudience, duration, style } = req.body;

    if (!sessionId || !productInfo) {
      res.status(400).json({ 
        success: false, 
        error: '缺少必要参数：sessionId 和 productInfo' 
      });
      return;
    }

    // 模拟AI生成脚本（实际项目中应该调用真实的AI API）
    const generatedScripts = generateMockScripts({
      productInfo,
      scriptType: scriptType || '产品介绍',
      targetAudience: targetAudience || '年轻消费者',
      duration: duration || 30,
      style: style || '专业'
    });

    // 保存到会话
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, { id: sessionId, scripts: [] });
    }
    
    const session = sessions.get(sessionId);
    session.scripts.push(...generatedScripts);

    res.status(200).json({
      success: true,
      data: {
        scripts: generatedScripts,
        sessionId
      }
    });

  } catch (error) {
    console.error('生成脚本错误:', error);
    res.status(500).json({ 
      success: false, 
      error: '生成脚本失败' 
    });
  }
}

function generateMockScripts(params: any) {
  const { productInfo, scriptType, targetAudience, duration, style } = params;
  
  return [
    {
      id: Date.now() + 1,
      title: `${scriptType} - 开场白`,
      content: `大家好！今天我要为大家介绍一款${productInfo}。这款产品专为${targetAudience}设计，${style}风格，${duration}秒的精彩内容即将开始！`,
      type: '开场白',
      duration: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: Date.now() + 2,
      title: `${scriptType} - 产品介绍`,
      content: `这款${productInfo}具有以下特点：\n1. 高品质材料\n2. 创新设计\n3. 用户友好\n4. 性价比高\n\n特别适合${targetAudience}使用。`,
      type: '产品介绍',
      duration: 15,
      createdAt: new Date().toISOString()
    },
    {
      id: Date.now() + 3,
      title: `${scriptType} - 结尾`,
      content: `这就是我们今天的${scriptType}。如果你对${productInfo}感兴趣，记得点赞关注！我们下期再见！`,
      type: '结尾',
      duration: 10,
      createdAt: new Date().toISOString()
    }
  ];
}
