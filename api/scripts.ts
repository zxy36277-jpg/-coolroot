import { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

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

  const { method, url } = req;

  try {
    // 健康检查
    if (method === 'GET' && url === '/api/scripts/health') {
      res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
      return;
    }

    // 创建会话
    if (method === 'POST' && url === '/api/scripts/sessions') {
      const sessionId = uuidv4();
      sessions[sessionId] = { id: sessionId, createdAt: new Date().toISOString() };
      scripts[sessionId] = [];
      
      res.status(200).json({ 
        success: true, 
        data: { sessionId } 
      });
      return;
    }

    // 生成脚本
    if (method === 'POST' && url === '/api/scripts/generate') {
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
        title: `${productInfo.brandName || '产品'}营销脚本`,
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
    if (method === 'GET' && url?.startsWith('/api/scripts/sessions/') && url.endsWith('/scripts')) {
      const sessionId = url.split('/')[4];
      const sessionScripts = scripts[sessionId] || [];
      
      res.status(200).json({ 
        success: true, 
        data: sessionScripts 
      });
      return;
    }

    // 文件上传
    if (method === 'POST' && url === '/api/scripts/upload') {
      // 模拟文件解析
      const mockExtractedInfo = {
        brandName: "测试品牌",
        sellingPoints: ["高性能", "优质材料", "性价比高"],
        promotionInfo: "限时8折优惠",
        industry: "3c数码",
        targetAudience: "25-35岁用户",
        videoPurpose: "广告营销卖货",
        platforms: ["抖音", "小红书"],
        forbiddenWords: "最好、第一、绝对"
      };

      const mockContent = "品牌名称：测试品牌\n核心卖点：高性能、优质材料、性价比高\n活动优惠：限时8折优惠\n行业：3c数码\n目标人群：25-35岁用户\n视频目的：广告营销卖货\n平台：抖音、小红书\n违禁词：最好、第一、绝对";
      
      res.status(200).json({ 
        success: true, 
        data: { 
          content: mockContent,
          extractedInfo: mockExtractedInfo
        } 
      });
      return;
    }

    // 404处理
    res.status(404).json({ 
      success: false,
      error: 'API端点不存在' 
    });

  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ 
      success: false,
      error: '服务器内部错误' 
    });
  }
}
