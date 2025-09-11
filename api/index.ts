import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 健康检查
  if (req.method === 'GET' && req.url === '/api/health') {
    res.status(200).json({ 
      status: 'ok', 
      message: 'API is running',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // 其他API路由
  if (req.method === 'POST' && req.url === '/api/generate-scripts') {
    // 模拟脚本生成
    const mockScript = {
      hook: "同样的预算，你会选择去年的旗舰，还是今年的性能猛兽？三秒告诉你答案！",
      content: "（0-3s）还在纠结选哪款？今天实测对比告诉你\n（4-10s）左手展示旧款：去年的旗舰机型，性能依旧能打；右手展示新款：但今年的新品，处理器升级30%\n（11-20s）特写镜头：采用全新航空级铝合金材质，手感提升明显",
      shootingGuide: "1. 采用分屏对比拍摄，左右画面同步展示性能测试\n2. 使用高速摄影机捕捉应用加载速度差异\n3. 材质特写使用微距镜头，突出质感差异",
      performanceMetrics: "ARPU 1.8万，CTR 6.5%，适配45秒短视频"
    };
    
    res.status(200).json({ success: true, script: mockScript });
    return;
  }

  // 404处理
  res.status(404).json({ error: 'Not found' });
}
