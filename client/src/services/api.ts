import axios from 'axios';
import { ScriptContent, ApiResponse, GenerateScriptsRequest, GenerateScriptsResponse } from '../types';

// 根据环境确定API基础URL
const getApiBaseUrl = () => {
  // 检查是否为开发环境
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5119/api';
  }
  
  // GitHub Pages环境使用模拟数据（不连接真实API）
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return null; // 返回null表示使用模拟数据
  }
  
  // 其他生产环境使用Vercel API
  return 'https://video-script-assistant.vercel.app/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('API请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('API响应:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('响应错误:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 模拟数据生成器
const generateMockData = () => {
  const baseScript: ScriptContent = {
    id: Date.now(),
    sessionId: 'mock-session',
    title: 'AI生成的营销脚本',
    hook: "同样的预算，你会选择去年的旗舰，还是今年的性能猛兽？三秒告诉你答案！",
    content: "（0-3s）还在纠结选哪款？今天实测对比告诉你\n（4-10s）左手展示旧款：去年的旗舰机型，性能依旧能打；右手展示新款：但今年的新品，处理器升级30%\n（11-20s）特写镜头：采用全新航空级铝合金材质，手感提升明显",
    shootingGuide: "1. 采用分屏对比拍摄，左右画面同步展示性能测试\n2. 使用高速摄影机捕捉应用加载速度差异\n3. 材质特写使用微距镜头，突出质感差异",
    performanceMetrics: "ARPU 1.8万，CTR 6.5%，适配45秒短视频",
    createdAt: new Date().toISOString()
  };

  const mockExtractedInfo = {
    brandName: "示例品牌",
    sellingPoints: ["高性能", "优质材料", "性价比高"],
    promotionInfo: "限时8折优惠",
    industry: "3c数码",
    targetAudience: "25-35岁用户",
    videoPurpose: "广告营销卖货",
    platforms: ["抖音", "小红书"],
    forbiddenWords: "最好、第一、绝对"
  };

  return { mockScript: baseScript, mockExtractedInfo };
};

export const apiService = {
  // 创建新会话
  async createSession(): Promise<string> {
    if (!API_BASE_URL) {
      // 生产环境返回模拟会话ID
      return 'mock-session-' + Date.now();
    }
    
    const response = await api.post<ApiResponse<{ sessionId: string }>>('/scripts/sessions');
    if (response.data.success && response.data.data) {
      return response.data.data.sessionId;
    }
    throw new Error(response.data.error || '创建会话失败');
  },

  // 生成脚本
  async generateScripts(request: GenerateScriptsRequest): Promise<GenerateScriptsResponse> {
    if (!API_BASE_URL) {
      // 生产环境返回模拟数据
      const { mockScript } = generateMockData();
      const sessionId = request.sessionId || 'mock-session-' + Date.now();
      
      // 生成6个不同模板的脚本
      const scripts: ScriptContent[] = [
        {
          ...mockScript,
          id: 1,
          templateType: '对比类',
          title: '对比类脚本 - 性能对比实测',
          hook: "同样的预算，你会选择去年的旗舰，还是今年的性能猛兽？三秒告诉你答案！",
          content: "（0-3s）还在纠结选哪款？今天实测对比告诉你\n（4-10s）左手展示旧款：去年的旗舰机型，性能依旧能打；右手展示新款：但今年的新品，处理器升级30%\n（11-20s）特写镜头：采用全新航空级铝合金材质，手感提升明显",
          shootingGuide: "1. 采用分屏对比拍摄，左右画面同步展示性能测试\n2. 使用高速摄影机捕捉应用加载速度差异\n3. 材质特写使用微距镜头，突出质感差异",
          performanceMetrics: "ARPU 1.8万，CTR 6.5%，适配45秒短视频"
        },
        {
          ...mockScript,
          id: 2,
          templateType: '测评类',
          title: '测评类脚本 - 深度体验评测',
          hook: "用了3个月，这款产品到底值不值得买？真实测评来了！",
          content: "（0-3s）3个月深度使用，今天告诉你真实感受\n（4-10s）外观展示：颜值在线，质感不错\n（11-20s）功能测试：性能稳定，续航给力",
          shootingGuide: "1. 多角度展示产品外观和细节\n2. 实际使用场景拍摄\n3. 数据测试画面配合解说",
          performanceMetrics: "ARPU 2.1万，CTR 7.2%，适配60秒短视频"
        },
        {
          ...mockScript,
          id: 3,
          templateType: '种草类',
          title: '种草类脚本 - 好物推荐',
          hook: "这个宝藏产品，我用了就停不下来！",
          content: "（0-3s）发现了一个宝藏产品，必须分享给大家\n（4-10s）使用效果展示：效果立竿见影\n（11-20s）价格对比：性价比超高",
          shootingGuide: "1. 使用前后对比效果\n2. 产品特写和细节展示\n3. 价格信息清晰展示",
          performanceMetrics: "ARPU 1.5万，CTR 8.1%，适配30秒短视频"
        },
        {
          ...mockScript,
          id: 4,
          templateType: '剧情类',
          title: '剧情类脚本 - 生活场景',
          hook: "早上起床发现，我的生活被它彻底改变了！",
          content: "（0-3s）早上起床，发现生活变得不一样了\n（4-10s）使用场景：让生活更便利\n（11-20s）效果展示：真的太好用了",
          shootingGuide: "1. 生活化场景拍摄\n2. 自然的使用过程记录\n3. 情感化的表达方式",
          performanceMetrics: "ARPU 1.9万，CTR 6.8%，适配50秒短视频"
        },
        {
          ...mockScript,
          id: 5,
          templateType: '知识类',
          title: '知识类脚本 - 科普讲解',
          hook: "为什么这个技术这么厉害？3分钟给你讲明白！",
          content: "（0-3s）这个技术为什么这么牛？今天科普一下\n（4-10s）技术原理：简单易懂的讲解\n（11-20s）实际应用：效果看得见",
          shootingGuide: "1. 科普动画配合讲解\n2. 技术原理可视化展示\n3. 实际应用场景演示",
          performanceMetrics: "ARPU 2.3万，CTR 5.9%，适配90秒短视频"
        },
        {
          ...mockScript,
          id: 6,
          templateType: '情感类',
          title: '情感类脚本 - 情感共鸣',
          hook: "每一个选择，都是为了更好的自己。",
          content: "（0-3s）每一个选择，都是为了更好的自己\n（4-10s）产品见证：陪伴你的成长\n（11-20s）情感升华：选择值得信赖的品牌",
          shootingGuide: "1. 情感化的镜头语言\n2. 温暖的色调和音乐\n3. 情感共鸣的场景设计",
          performanceMetrics: "ARPU 1.7万，CTR 7.5%，适配40秒短视频"
        }
      ];
      
      return {
        sessionId,
        scripts
      };
    }
    
    const response = await api.post<ApiResponse<GenerateScriptsResponse>>('/scripts/generate', request);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || '生成脚本失败');
  },

  // 获取脚本列表
  async getScripts(sessionId: string): Promise<ScriptContent[]> {
    if (!API_BASE_URL) {
      // 生产环境返回模拟数据
      const { mockScript } = generateMockData();
      return [mockScript];
    }
    
    const response = await api.get<ApiResponse<ScriptContent[]>>(`/scripts/scripts/${sessionId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || '获取脚本列表失败');
  },

  // 更新脚本
  async updateScript(id: number, updates: Partial<ScriptContent>): Promise<void> {
    if (!API_BASE_URL) {
      // 生产环境模拟成功
      return Promise.resolve();
    }
    
    const response = await api.put<ApiResponse>(`/scripts/scripts/${id}`, updates);
    if (!response.data.success) {
      throw new Error(response.data.error || '更新脚本失败');
    }
  },

  // 基于模板生成新脚本
  async generateScriptByTemplate(sessionId: string, templateType: string): Promise<ScriptContent> {
    if (!API_BASE_URL) {
      // 生产环境返回模拟数据
      const { mockScript } = generateMockData();
      return mockScript;
    }
    
    const response = await api.post<ApiResponse<ScriptContent>>(`/scripts/sessions/${sessionId}/templates/${templateType}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || '生成模板脚本失败');
  },

  // 导出脚本
  async exportScripts(sessionId: string): Promise<Blob> {
    if (!API_BASE_URL) {
      // 生产环境返回模拟数据
      const { mockScript } = generateMockData();
      const content = `脚本标题：${mockScript.title}\n\n钩子：${mockScript.hook}\n\n内容：${mockScript.content}\n\n拍摄指南：${mockScript.shootingGuide}\n\n性能指标：${mockScript.performanceMetrics}`;
      return new Blob([content], { type: 'text/plain' });
    }
    
    const response = await api.get(`/scripts/scripts/${sessionId}/export`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // 上传文件
  async uploadFile(file: File): Promise<{ content: string; extractedInfo: any }> {
    if (!API_BASE_URL) {
      // 生产环境使用模拟数据
      const content = await this.readFileAsText(file);
      
      // 模拟AI解析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 基于文件内容智能提取信息
      const extractedInfo = this.simulateAIExtraction(content, file.name);
      
      return {
        content,
        extractedInfo
      };
    }
    
    // 检查文件类型
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'pdf' || fileExt === 'doc' || fileExt === 'docx') {
      // 对于PDF和Word文档，使用FormData上传
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<ApiResponse<{ content: string; extractedInfo: any }>>('/scripts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || '文件上传失败');
    } else {
      // 对于文本文件，直接读取内容
      const fileContent = await this.readFileAsText(file);
      
      const response = await api.post<ApiResponse<{ content: string; extractedInfo: any }>>('/scripts/upload', fileContent, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || '文件上传失败');
    }
  },

  // 读取文件为文本
  readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file, 'UTF-8');
    });
  },

  // 模拟AI智能提取信息
  simulateAIExtraction(content: string, fileName: string): any {
    const text = content.toLowerCase();
    
    // 品牌名称提取
    let brandName = '';
    const brandPatterns = [
      /品牌[：:]\s*([^\n\r,，]+)/,
      /品牌名[：:]\s*([^\n\r,，]+)/,
      /产品[：:]\s*([^\n\r,，]+)/,
      /([a-zA-Z\u4e00-\u9fa5]{2,8})\s*(?:品牌|产品|手机|电脑|耳机|相机)/
    ];
    
    for (const pattern of brandPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        brandName = match[1].trim();
        break;
      }
    }
    
    if (!brandName) {
      // 从文件名提取
      const nameMatch = fileName.match(/([a-zA-Z\u4e00-\u9fa5]{2,8})/);
      if (nameMatch) {
        brandName = nameMatch[1];
      } else {
        brandName = '示例品牌';
      }
    }
    
    // 行业识别
    let industry = '';
    const industryKeywords = {
      '3c数码': ['手机', '电脑', '耳机', '相机', '数码', '电子', '智能', '科技'],
      '美妆护肤': ['化妆品', '护肤品', '美妆', '口红', '面膜', '精华', '乳液'],
      '服装': ['衣服', '服装', '上衣', '裤子', '裙子', '外套', '时尚'],
      '食品': ['食品', '零食', '饮料', '水果', '蔬菜', '肉类', '营养'],
      '家居家纺': ['家具', '家居', '床品', '窗帘', '装饰', '收纳'],
      '保健品': ['保健品', '维生素', '营养品', '健康', '养生'],
      '个护百货': ['洗发水', '沐浴露', '牙膏', '牙刷', '毛巾', '个护'],
      '大小家电': ['冰箱', '洗衣机', '空调', '电视', '家电', '电器'],
      '内衣内裤': ['内衣', '内裤', '文胸', '睡衣', '家居服'],
      '鞋服箱包': ['鞋子', '包包', '箱包', '运动鞋', '皮鞋']
    };
    
    for (const [ind, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        industry = ind;
        break;
      }
    }
    
    if (!industry) {
      industry = '3c数码'; // 默认行业
    }
    
    // 卖点提取
    const sellingPoints = [];
    const sellingPointPatterns = [
      /卖点[：:]\s*([^\n\r]+)/,
      /特点[：:]\s*([^\n\r]+)/,
      /优势[：:]\s*([^\n\r]+)/,
      /亮点[：:]\s*([^\n\r]+)/
    ];
    
    for (const pattern of sellingPointPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const points = match[1].split(/[，,、；;]/).map(p => p.trim()).filter(p => p);
        sellingPoints.push(...points.slice(0, 3));
      }
    }
    
    // 如果没有找到卖点，使用默认值
    if (sellingPoints.length === 0) {
      sellingPoints.push('高性能', '优质材料', '性价比高');
    }
    
    // 优惠信息提取
    let promotionInfo = '';
    const promotionPatterns = [
      /优惠[：:]\s*([^\n\r]+)/,
      /活动[：:]\s*([^\n\r]+)/,
      /促销[：:]\s*([^\n\r]+)/,
      /(限时\d+折|买\d+送\d+|满\d+减\d+)/g
    ];
    
    for (const pattern of promotionPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        promotionInfo = match[1].trim();
        break;
      }
    }
    
    if (!promotionInfo) {
      promotionInfo = '限时8折优惠';
    }
    
    // 目标人群提取
    let targetAudience = '';
    const audiencePatterns = [
      /目标人群[：:]\s*([^\n\r]+)/,
      /适用人群[：:]\s*([^\n\r]+)/,
      /用户群体[：:]\s*([^\n\r]+)/
    ];
    
    for (const pattern of audiencePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        targetAudience = match[1].trim();
        break;
      }
    }
    
    if (!targetAudience) {
      targetAudience = '25-35岁用户';
    }
    
    // 平台信息
    const platforms = ['抖音', '小红书'];
    
    // 违禁词
    const forbiddenWords = '最好、第一、绝对';
    
    return {
      brandName,
      sellingPoints: sellingPoints.slice(0, 3),
      promotionInfo,
      industry,
      targetAudience,
      videoPurpose: '广告营销卖货',
      platforms,
      forbiddenWords
    };
  }
};

export default apiService;
