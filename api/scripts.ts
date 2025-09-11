import { VercelRequest, VercelResponse } from '@vercel/node';

// 简单的UUID生成函数
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 模拟数据库存储
const sessions: { [key: string]: any } = {};
const scripts: { [key: string]: any[] } = {};

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
    // 生成脚本 - 主要功能
    if (req.method === 'POST') {
      const { sessionId, productInfo } = req.body;
      
      if (!sessionId || !productInfo) {
        res.status(400).json({ 
          success: false, 
          error: '缺少必要参数' 
        });
        return;
      }

      // 模拟生成脚本
      const mockScript = {
        id: Date.now(),
        sessionId,
        title: `${productInfo.name || '产品'}营销脚本`,
        hook: "同样的预算，你会选择去年的旗舰，还是今年的性能猛兽？三秒告诉你答案！",
        content: "（0-3s）还在纠结选哪款？今天实测对比告诉你\n（4-10s）左手展示旧款：去年的旗舰机型，性能依旧能打；右手展示新款：但今年的新品，处理器升级30%\n（11-20s）特写镜头：采用全新航空级铝合金材质，手感提升明显",
        shootingGuide: "1. 采用分屏对比拍摄，左右画面同步展示性能测试\n2. 使用高速摄影机捕捉应用加载速度差异\n3. 材质特写使用微距镜头，突出质感差异",
        performanceMetrics: "ARPU 1.8万，CTR 6.5%，适配45秒短视频",
        createdAt: new Date().toISOString()
      };

      if (!scripts[sessionId]) {
        scripts[sessionId] = [];
      }
      scripts[sessionId].push(mockScript);
      
      res.status(200).json({ 
        success: true, 
        data: { script: mockScript } 
      });
      return;
    }

    // 获取脚本列表
    if (req.method === 'GET') {
      const { sessionId } = req.query;
      
      if (!sessionId || typeof sessionId !== 'string') {
        res.status(400).json({ 
          success: false, 
          error: '缺少sessionId参数' 
        });
        return;
      }

      const sessionScripts = scripts[sessionId] || [];
      
      res.status(200).json({ 
        success: true, 
        data: sessionScripts 
      });
      return;
    }

    res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });

  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ 
      success: false,
      error: '服务器内部错误' 
    });
  }
}