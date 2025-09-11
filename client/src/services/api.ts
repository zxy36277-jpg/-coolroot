import axios from 'axios';
import { ScriptContent, ApiResponse, GenerateScriptsRequest, GenerateScriptsResponse } from '../types';

// 根据环境确定API基础URL
const getApiBaseUrl = () => {
  // 检查是否为开发环境
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5119/api';
  }
  
  // 检查是否为GitHub Pages环境
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    // 临时使用本地服务器（需要确保本地服务器运行）
    return 'http://192.168.1.24:5119/api';
  }
  
  // 检查是否为Vercel部署环境
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return '/api';
  }
  
  // 默认生产环境
  return '/api';
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

export const apiService = {
  // 创建新会话
  async createSession(): Promise<string> {
    const response = await api.post<ApiResponse<{ sessionId: string }>>('/sessions');
    if (response.data.success && response.data.data) {
      return response.data.data.sessionId;
    }
    throw new Error(response.data.error || '创建会话失败');
  },

  // 生成脚本
  async generateScripts(request: GenerateScriptsRequest): Promise<GenerateScriptsResponse> {
    const response = await api.post<ApiResponse<GenerateScriptsResponse>>('/generate', request);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || '生成脚本失败');
  },

  // 获取脚本列表
  async getScripts(sessionId: string): Promise<ScriptContent[]> {
    const response = await api.get<ApiResponse<ScriptContent[]>>(`/scripts/${sessionId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || '获取脚本列表失败');
  },

  // 更新脚本
  async updateScript(id: number, updates: Partial<ScriptContent>): Promise<void> {
    const response = await api.put<ApiResponse>(`/scripts/${id}`, updates);
    if (!response.data.success) {
      throw new Error(response.data.error || '更新脚本失败');
    }
  },

  // 基于模板生成新脚本
  async generateScriptByTemplate(sessionId: string, templateType: string): Promise<ScriptContent> {
    const response = await api.post<ApiResponse<ScriptContent>>(`/sessions/${sessionId}/templates/${templateType}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || '生成模板脚本失败');
  },

  // 导出脚本
  async exportScripts(sessionId: string): Promise<Blob> {
    const response = await api.get(`/scripts/${sessionId}/export`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // 上传文件
  async uploadFile(file: File): Promise<{ content: string; extractedInfo: any }> {
    // 读取文件内容为文本
    const fileContent = await this.readFileAsText(file);
    
    // 使用文本内容发送请求
    const response = await api.post<ApiResponse<{ content: string; extractedInfo: any }>>('/upload', fileContent, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || '文件上传失败');
  }

  // 读取文件为文本
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file, 'UTF-8');
    });
  }
};

export default apiService;
