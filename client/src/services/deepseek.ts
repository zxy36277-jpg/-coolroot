import axios from 'axios';

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = 'sk-295761577e304806a3c5c17b0064d11c';

// 创建DeepSeek API客户端
const deepseekApi = axios.create({
  baseURL: DEEPSEEK_API_URL,
  timeout: 60000, // 60秒超时
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
  },
});

// 文件内容分析接口
export interface FileAnalysisRequest {
  content: string;
  fileName: string;
  fileType: string;
}

export interface FileAnalysisResponse {
  brandName: string;
  sellingPoints: string[];
  promotionInfo: string;
  industry: string;
  targetAudience: string;
  videoPurpose: string;
  platforms: string[];
  forbiddenWords: string;
  productFeatures: string[];
  priceRange: string;
  competitiveAdvantages: string[];
  emotionalAppeals: string[];
  callToAction: string;
  confidence: number; // 分析置信度 0-1
}

// 脚本生成接口
export interface ScriptGenerationRequest {
  extractedInfo: FileAnalysisResponse;
  templateType: string;
  videoLength: number; // 秒
  platform: string;
  targetAudience: string;
}

export interface ScriptGenerationResponse {
  title: string;
  hook: string;
  content: string;
  shootingGuide: string;
  performanceMetrics: string;
  coverSuggestion: {
    title: string;
    description: string;
  };
  hashtags: string[];
  callToAction: string;
}

class DeepSeekService {
  // 分析文件内容，提取产品信息
  async analyzeFileContent(request: FileAnalysisRequest): Promise<FileAnalysisResponse> {
    const systemPrompt = `你是一个专业的短视频营销分析师，擅长从产品文档中提取关键营销信息。

请仔细分析以下文件内容，提取以下信息：

1. 品牌名称 (brandName): 从文档中识别产品品牌
2. 卖点 (sellingPoints): 提取3-5个核心卖点
3. 优惠信息 (promotionInfo): 识别促销活动、价格优惠等
4. 行业 (industry): 判断产品所属行业类别
5. 目标人群 (targetAudience): 分析目标用户群体
6. 视频目的 (videoPurpose): 确定视频营销目标
7. 平台 (platforms): 推荐适合的短视频平台
8. 违禁词 (forbiddenWords): 列出需要避免的敏感词汇
9. 产品特性 (productFeatures): 详细的产品功能特性
10. 价格区间 (priceRange): 产品价格范围
11. 竞争优势 (competitiveAdvantages): 相比竞品的优势
12. 情感诉求 (emotionalAppeals): 能触达用户情感的点
13. 行动号召 (callToAction): 引导用户行动的文案
14. 置信度 (confidence): 对分析结果的信心程度(0-1)

请以JSON格式返回结果，确保所有字段都有合理的值。`;

    const userPrompt = `文件名称: ${request.fileName}
文件类型: ${request.fileType}

文件内容:
${request.content}

请分析以上内容并提取营销信息。`;

    try {
      const response = await deepseekApi.post('', {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        temperature: 0.3, // 降低随机性，提高准确性
      });

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('DeepSeek API返回空内容');
      }

      // 尝试解析JSON响应
      let analysisResult: FileAnalysisResponse;
      try {
        // 提取JSON部分（可能包含在markdown代码块中）
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
        analysisResult = JSON.parse(jsonString);
      } catch (parseError) {
        console.warn('JSON解析失败，使用备用解析方法:', parseError);
        // 如果JSON解析失败，使用正则表达式提取关键信息
        analysisResult = this.fallbackParse(content);
      }

      // 验证和补充缺失字段
      return this.validateAndCompleteAnalysis(analysisResult);
    } catch (error) {
      console.error('DeepSeek API调用失败:', error);
      // 返回默认分析结果
      return this.getDefaultAnalysis(request);
    }
  }

  // 生成短视频脚本
  async generateScript(request: ScriptGenerationRequest): Promise<ScriptGenerationResponse> {
    const systemPrompt = `你是一个专业的短视频脚本创作专家，擅长创作高转化率的营销脚本。

请根据提供的产品信息，创作一个${request.templateType}类型的短视频脚本。

脚本要求：
1. 标题要吸引人，突出产品核心价值
2. 钩子要3秒内抓住用户注意力
3. 内容要分段明确，每段都有具体时间点
4. 拍摄指南要详细实用
5. 性能指标要符合行业标准
6. 封面建议要突出卖点
7. 话题标签要精准相关
8. 行动号召要明确有力

脚本长度: ${request.videoLength}秒
目标平台: ${request.platform}
目标人群: ${request.targetAudience}

请以JSON格式返回结果。`;

    const userPrompt = `产品信息:
品牌: ${request.extractedInfo.brandName}
行业: ${request.extractedInfo.industry}
卖点: ${request.extractedInfo.sellingPoints.join('、')}
目标人群: ${request.extractedInfo.targetAudience}
竞争优势: ${request.extractedInfo.competitiveAdvantages.join('、')}
情感诉求: ${request.extractedInfo.emotionalAppeals.join('、')}
价格区间: ${request.extractedInfo.priceRange}
优惠信息: ${request.extractedInfo.promotionInfo}

请创作一个专业的短视频脚本。`;

    try {
      const response = await deepseekApi.post('', {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        temperature: 0.7, // 适中的创造性
      });

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('DeepSeek API返回空内容');
      }

      // 解析JSON响应
      let scriptResult: ScriptGenerationResponse;
      try {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
        scriptResult = JSON.parse(jsonString);
      } catch (parseError) {
        console.warn('脚本JSON解析失败，使用备用解析方法:', parseError);
        scriptResult = this.fallbackScriptParse(content, request);
      }

      return this.validateAndCompleteScript(scriptResult);
    } catch (error) {
      console.error('脚本生成失败:', error);
      return this.getDefaultScript(request);
    }
  }

  // 备用解析方法（当JSON解析失败时）
  private fallbackParse(content: string): FileAnalysisResponse {
    const extractField = (pattern: RegExp, defaultValue: any) => {
      const match = content.match(pattern);
      return match ? match[1]?.trim() : defaultValue;
    };

    return {
      brandName: extractField(/品牌[：:]\s*([^\n\r]+)/, '示例品牌'),
      sellingPoints: extractField(/卖点[：:]\s*([^\n\r]+)/, '高性能、优质材料、性价比高').split(/[，,、；;]/).map(s => s.trim()).filter(s => s),
      promotionInfo: extractField(/优惠[：:]\s*([^\n\r]+)/, '限时8折优惠'),
      industry: extractField(/行业[：:]\s*([^\n\r]+)/, '3c数码'),
      targetAudience: extractField(/目标人群[：:]\s*([^\n\r]+)/, '25-35岁用户'),
      videoPurpose: '广告营销卖货',
      platforms: ['抖音', '小红书'],
      forbiddenWords: '最好、第一、绝对',
      productFeatures: ['功能强大', '设计精美', '使用便捷'],
      priceRange: '100-500元',
      competitiveAdvantages: ['性价比高', '品质可靠'],
      emotionalAppeals: ['提升生活品质', '展现个人品味'],
      callToAction: '立即购买，享受优惠',
      confidence: 0.6
    };
  }

  // 备用脚本解析方法
  private fallbackScriptParse(content: string, request: ScriptGenerationRequest): ScriptGenerationResponse {
    return {
      title: `${request.extractedInfo.brandName} - ${request.templateType}脚本`,
      hook: `这个${request.extractedInfo.brandName}产品，为什么这么受欢迎？`,
      content: `（0-3s）${request.extractedInfo.brandName}产品介绍\n（4-10s）核心卖点展示\n（11-20s）使用效果演示`,
      shootingGuide: '1. 产品特写展示\n2. 使用场景拍摄\n3. 效果对比演示',
      performanceMetrics: 'ARPU 1.5万，CTR 6.0%，适配30秒短视频',
      coverSuggestion: {
        title: request.extractedInfo.brandName,
        description: request.extractedInfo.sellingPoints[0] || '优质产品'
      },
      hashtags: [`#${request.extractedInfo.brandName}`, '#好物推荐', '#性价比'],
      callToAction: '点击购买，限时优惠'
    };
  }

  // 验证和补充分析结果
  private validateAndCompleteAnalysis(result: any): FileAnalysisResponse {
    return {
      brandName: result.brandName || '示例品牌',
      sellingPoints: Array.isArray(result.sellingPoints) ? result.sellingPoints.slice(0, 5) : ['高性能', '优质材料', '性价比高'],
      promotionInfo: result.promotionInfo || '限时8折优惠',
      industry: result.industry || '3c数码',
      targetAudience: result.targetAudience || '25-35岁用户',
      videoPurpose: result.videoPurpose || '广告营销卖货',
      platforms: Array.isArray(result.platforms) ? result.platforms : ['抖音', '小红书'],
      forbiddenWords: result.forbiddenWords || '最好、第一、绝对',
      productFeatures: Array.isArray(result.productFeatures) ? result.productFeatures : ['功能强大', '设计精美'],
      priceRange: result.priceRange || '100-500元',
      competitiveAdvantages: Array.isArray(result.competitiveAdvantages) ? result.competitiveAdvantages : ['性价比高'],
      emotionalAppeals: Array.isArray(result.emotionalAppeals) ? result.emotionalAppeals : ['提升生活品质'],
      callToAction: result.callToAction || '立即购买，享受优惠',
      confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0.7
    };
  }

  // 验证和补充脚本结果
  private validateAndCompleteScript(result: any): ScriptGenerationResponse {
    return {
      title: result.title || 'AI生成的营销脚本',
      hook: result.hook || '这个产品为什么这么受欢迎？',
      content: result.content || '（0-3s）产品介绍\n（4-10s）卖点展示\n（11-20s）效果演示',
      shootingGuide: result.shootingGuide || '1. 产品特写\n2. 使用场景\n3. 效果对比',
      performanceMetrics: result.performanceMetrics || 'ARPU 1.5万，CTR 6.0%，适配30秒短视频',
      coverSuggestion: {
        title: result.coverSuggestion?.title || '产品推荐',
        description: result.coverSuggestion?.description || '优质产品，值得拥有'
      },
      hashtags: Array.isArray(result.hashtags) ? result.hashtags : ['#好物推荐', '#性价比'],
      callToAction: result.callToAction || '立即购买'
    };
  }

  // 获取默认分析结果
  private getDefaultAnalysis(request: FileAnalysisRequest): FileAnalysisResponse {
    return {
      brandName: this.extractBrandFromFileName(request.fileName),
      sellingPoints: ['高性能', '优质材料', '性价比高'],
      promotionInfo: '限时8折优惠',
      industry: '3c数码',
      targetAudience: '25-35岁用户',
      videoPurpose: '广告营销卖货',
      platforms: ['抖音', '小红书'],
      forbiddenWords: '最好、第一、绝对',
      productFeatures: ['功能强大', '设计精美', '使用便捷'],
      priceRange: '100-500元',
      competitiveAdvantages: ['性价比高', '品质可靠'],
      emotionalAppeals: ['提升生活品质', '展现个人品味'],
      callToAction: '立即购买，享受优惠',
      confidence: 0.5
    };
  }

  // 获取默认脚本
  private getDefaultScript(request: ScriptGenerationRequest): ScriptGenerationResponse {
    return {
      title: `${request.extractedInfo.brandName} - ${request.templateType}脚本`,
      hook: `这个${request.extractedInfo.brandName}产品，为什么这么受欢迎？`,
      content: `（0-3s）${request.extractedInfo.brandName}产品介绍\n（4-10s）核心卖点展示\n（11-20s）使用效果演示`,
      shootingGuide: '1. 产品特写展示\n2. 使用场景拍摄\n3. 效果对比演示',
      performanceMetrics: 'ARPU 1.5万，CTR 6.0%，适配30秒短视频',
      coverSuggestion: {
        title: request.extractedInfo.brandName,
        description: request.extractedInfo.sellingPoints[0] || '优质产品'
      },
      hashtags: [`#${request.extractedInfo.brandName}`, '#好物推荐', '#性价比'],
      callToAction: '点击购买，限时优惠'
    };
  }

  // 从文件名提取品牌名
  private extractBrandFromFileName(fileName: string): string {
    const nameMatch = fileName.match(/([a-zA-Z\u4e00-\u9fa5]{2,8})/);
    return nameMatch ? nameMatch[1] : '示例品牌';
  }
}

export const deepseekService = new DeepSeekService();
export default deepseekService;
