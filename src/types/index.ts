// 产品信息接口
export interface ProductInfo {
  brandName: string;
  sellingPoints: string[];
  promotionInfo: string;
  industry: string;
  targetAudience: string;
  videoPurpose: string;
  platforms: string[];
  forbiddenWords: string;
}

// 脚本内容接口
export interface ScriptContent {
  id?: number;
  sessionId: string;
  templateType: string;
  title: string;
  coverSuggestion: string;
  hook: string;
  content: string;
  shootingGuide: string;
  performanceMetrics: string;
  createdAt?: string;
}

// 会话接口
export interface Session {
  id: string;
  createdAt: string;
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 脚本生成请求接口
export interface GenerateScriptsRequest {
  productInfo: ProductInfo;
  sessionId?: string;
}

// 脚本生成响应接口
export interface GenerateScriptsResponse {
  sessionId: string;
  scripts: ScriptContent[];
}

// 脚本模板类型
export type ScriptTemplateType = 
  | 'problem_solution'
  | 'product_showcase'
  | 'story_telling'
  | 'comparison'
  | 'tutorial'
  | 'testimonial';

// 行业类型
export type IndustryType = 
  | '服装'
  | '美妆护肤'
  | '3c数码'
  | '家居家纺'
  | '食品'
  | '保健品'
  | '个护百货'
  | '大小家电'
  | '内衣内裤'
  | '鞋服箱包';

// 短视频目的类型
export type VideoPurposeType = 
  | '广告营销卖货'
  | '直播间引流'
  | '种草带货'
  | '品宣曝光机制';
