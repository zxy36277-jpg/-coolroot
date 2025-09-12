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
  productFeatures?: string[];
  priceRange?: string;
  competitiveAdvantages?: string[];
  emotionalAppeals?: string[];
  callToAction?: string;
  confidence?: number;
}

// 脚本内容接口
export interface ScriptContent {
  id?: number;
  sessionId: string;
  templateType: string;
  title: string;
  coverSuggestion?: string;
  hook: string;
  content: string;
  shootingGuide: string;
  performanceMetrics: string;
  hashtags?: string[];
  callToAction?: string;
  createdAt?: string;
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
  productInfo?: ProductInfo;
  extractedInfo?: any;
  sessionId?: string;
}

// 脚本生成响应接口
export interface GenerateScriptsResponse {
  sessionId: string;
  scripts: ScriptContent[];
}

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

// 平台类型
export type PlatformType = 
  | '抖音'
  | '快手'
  | '小红书'
  | '视频号'
  | 'B站'
  | '淘宝'
  | '京东';

// 表单状态
export interface FormState {
  productInfo: ProductInfo;
  isLoading: boolean;
  error: string | null;
}

// 脚本状态
export interface ScriptState {
  scripts: ScriptContent[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}
