/**
 * 基于DeepSeek大模型的智能产品信息解析器
 * 解决传统规则匹配无法准确识别产品类型的问题
 */

interface AIParseResult {
  brandName: string;
  sellingPoints: string[];
  industry: string;
  targetAudience: string;
  purpose: string;
  platforms: string[];
  discount: string;
  forbiddenWords: string[];
  confidence: number; // 解析置信度 0-1
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIParser {
  private readonly apiKey = 'sk-295761577e304806a3c5c17b0064d11c';
  private readonly apiUrl = 'https://api.deepseek.com/chat/completions';

  /**
   * 使用DeepSeek大模型智能解析产品信息
   */
  async parseProductInfo(text: string): Promise<AIParseResult> {
    try {
      console.log('🤖 开始AI智能解析...');
      
      const prompt = this.buildPrompt(text);
      const response = await this.callDeepSeekAPI(prompt);
      const result = this.parseAIResponse(response);
      
      console.log('✅ AI解析完成:', result);
      return result;
    } catch (error) {
      console.error('❌ AI解析失败:', error);
      // 降级到传统解析
      return this.fallbackParsing(text);
    }
  }

  /**
   * 构建给AI的提示词
   */
  private buildPrompt(text: string): string {
    return `你是一个专业的产品信息解析专家。请仔细分析以下产品信息，并准确识别产品类型和相关信息。

产品信息：
${text}

请按照以下JSON格式返回解析结果，确保准确性：

{
  "brandName": "品牌名称（如：汤臣倍健、安利、华为、小米等）",
  "sellingPoints": ["核心卖点1", "核心卖点2", "核心卖点3"],
  "industry": "产品行业（如：保健品、3C数码、美妆护肤、服装鞋包、食品饮料、家居用品、汽车用品、运动户外、母婴用品、宠物用品等）",
  "targetAudience": "目标人群（如：中老年人、年轻女性、商务人士、学生群体、健身人群等）",
  "purpose": "营销目的（如：品牌宣传、产品推广、促销活动、新品发布等）",
  "platforms": ["抖音", "快手", "小红书", "B站", "淘宝", "京东"],
  "discount": "优惠信息（如：买一送一、限时8折、满减优惠等）",
  "forbiddenWords": ["违禁词1", "违禁词2"],
  "confidence": 0.95
}

重要提示：
1. 仔细分析产品描述，准确判断产品类型（保健品、3C数码、美妆等）
2. 保健品通常包含：维生素、蛋白粉、钙片、鱼油、益生菌、胶原蛋白等关键词
3. 3C数码通常包含：手机、电脑、耳机、相机、智能设备等关键词
4. 美妆护肤通常包含：面膜、精华、口红、粉底、护肤品等关键词
5. 如果信息不完整，请根据上下文合理推断
6. confidence表示解析的置信度（0-1之间）

请只返回JSON格式的结果，不要包含其他文字。`;
  }

  /**
   * 调用DeepSeek API
   */
  private async callDeepSeekAPI(prompt: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的产品信息解析专家，擅长准确识别产品类型和提取关键信息。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false,
        temperature: 0.1, // 降低随机性，提高准确性
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API调用失败: ${response.status} ${response.statusText}`);
    }

    const data: DeepSeekResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * 解析AI返回的JSON结果
   */
  private parseAIResponse(response: string): AIParseResult {
    try {
      // 清理响应文本，提取JSON部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法从AI响应中提取JSON');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      // 验证和标准化结果
      return {
        brandName: this.validateString(result.brandName, '品牌名称'),
        sellingPoints: this.validateArray(result.sellingPoints, '卖点'),
        industry: this.validateString(result.industry, '行业'),
        targetAudience: this.validateString(result.targetAudience, '目标人群'),
        purpose: this.validateString(result.purpose, '营销目的'),
        platforms: this.validateArray(result.platforms, '平台'),
        discount: this.validateString(result.discount, '优惠信息'),
        forbiddenWords: this.validateArray(result.forbiddenWords, '违禁词'),
        confidence: Math.min(Math.max(result.confidence || 0.8, 0), 1)
      };
    } catch (error) {
      console.error('AI响应解析失败:', error);
      throw new Error('AI响应格式错误');
    }
  }

  /**
   * 验证字符串字段
   */
  private validateString(value: any, fieldName: string): string {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    console.warn(`⚠️ ${fieldName}字段缺失或无效，使用默认值`);
    return this.getDefaultValue(fieldName);
  }

  /**
   * 验证数组字段
   */
  private validateArray(value: any, fieldName: string): string[] {
    if (Array.isArray(value) && value.length > 0) {
      return value.filter(item => typeof item === 'string' && item.trim()).slice(0, 3);
    }
    console.warn(`⚠️ ${fieldName}字段缺失或无效，使用默认值`);
    return this.getDefaultArray(fieldName);
  }

  /**
   * 获取默认值
   */
  private getDefaultValue(fieldName: string): string {
    const defaults: Record<string, string> = {
      '品牌名称': '未知品牌',
      '行业': '其他',
      '目标人群': '通用人群',
      '营销目的': '产品推广',
      '优惠信息': '无'
    };
    return defaults[fieldName] || '未知';
  }

  /**
   * 获取默认数组
   */
  private getDefaultArray(fieldName: string): string[] {
    const defaults: Record<string, string[]> = {
      '卖点': ['优质产品', '值得信赖'],
      '平台': ['抖音', '快手'],
      '违禁词': []
    };
    return defaults[fieldName] || [];
  }

  /**
   * 降级到传统解析（当AI解析失败时）
   */
  private fallbackParsing(text: string): AIParseResult {
    console.log('🔄 降级到传统解析...');
    
    // 简单的关键词匹配作为降级方案
    const industry = this.detectIndustryByKeywords(text);
    
    return {
      brandName: '未知品牌',
      sellingPoints: ['优质产品'],
      industry,
      targetAudience: '通用人群',
      purpose: '产品推广',
      platforms: ['抖音', '快手'],
      discount: '无',
      forbiddenWords: [],
      confidence: 0.3 // 低置信度
    };
  }

  /**
   * 基于关键词检测行业类型
   */
  private detectIndustryByKeywords(text: string): string {
    const keywords = {
      '保健品': ['维生素', '蛋白粉', '钙片', '鱼油', '益生菌', '胶原蛋白', '保健品', '营养品', '膳食补充剂'],
      '3C数码': ['手机', '电脑', '耳机', '相机', '智能设备', '数码', '电子', '科技'],
      '美妆护肤': ['面膜', '精华', '口红', '粉底', '护肤品', '化妆品', '美妆', '护肤'],
      '服装鞋包': ['衣服', '鞋子', '包包', '服装', '时尚', '穿搭'],
      '食品饮料': ['食品', '饮料', '零食', '饮品', '美食'],
      '家居用品': ['家具', '家电', '家居', '生活用品'],
      '汽车用品': ['汽车', '车用', '车载', '汽配'],
      '运动户外': ['运动', '健身', '户外', '体育'],
      '母婴用品': ['母婴', '婴儿', '儿童', '宝宝'],
      '宠物用品': ['宠物', '猫', '狗', '宠物用品']
    };

    const lowerText = text.toLowerCase();
    
    for (const [industry, words] of Object.entries(keywords)) {
      if (words.some(word => lowerText.includes(word))) {
        return industry;
      }
    }
    
    return '其他';
  }
}

export const aiParser = new AIParser();
