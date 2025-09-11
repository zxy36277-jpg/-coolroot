import axios from 'axios';
import { ScriptContent, ApiResponse, GenerateScriptsRequest, GenerateScriptsResponse } from '../types';

// 根据环境确定API基础URL
const getApiBaseUrl = () => {
  // 检查是否为开发环境
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5119/api';
  }
  
  // 生产环境使用Vercel API
  // 请将下面的URL替换为您的实际Vercel部署地址
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
  const mockScript: ScriptContent = {
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

  return { mockScript, mockExtractedInfo };
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
      return {
        script: mockScript,
        success: true
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
      const { mockExtractedInfo } = generateMockData();
      const content = await this.readFileAsText(file);
      
      // 模拟AI解析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        content,
        extractedInfo: mockExtractedInfo
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
  }
};

export default apiService;
