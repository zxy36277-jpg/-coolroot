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
1. 仔细分析产品描述，准确判断产品类型：
   - 保健品：维生素、蛋白粉、钙片、鱼油、益生菌、胶原蛋白、营养补充剂、膳食补充剂
   - 3C数码：手机、电脑、耳机、相机、智能设备、数码产品、电子产品
   - 美妆护肤：面膜、精华、口红、粉底、护肤品、化妆品
   - 服装鞋包：衣服、鞋子、包包、服装、时尚、穿搭
   - 食品饮料：食品、饮料、零食、饮品、美食
   - 家居用品：家具、家电、家居、生活用品
   - 汽车用品：汽车、车用、车载、汽配
   - 运动户外：运动、健身、户外、体育
   - 母婴用品：母婴、婴儿、儿童、宝宝
   - 宠物用品：宠物、猫、狗、宠物用品

2. 目标人群识别规则：
   - 如果明确提到"目标人群"，使用该信息
   - 如果提到"适用人群"，使用该信息
   - 如果提到"不适用人群"，不要使用该信息作为目标人群
   - 根据产品特性合理推断目标人群

3. 营销目的识别规则：
   - 如果明确提到"营销目的"，使用该信息
   - 如果提到"推广目的"，使用该信息
   - 根据上下文合理推断营销目的

4. 如果信息不完整，请根据上下文合理推断
5. confidence表示解析的置信度（0-1之间）

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

    const data = await response.json() as DeepSeekResponse;
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
      '保健品': ['维生素', '蛋白粉', '钙片', '鱼油', '益生菌', '胶原蛋白', '保健品', '营养品', '膳食补充剂', '营养补充剂', '软胶囊', '胶囊', '营养', '健康', '免疫力', '骨骼健康', '心血管健康', '肠道菌群', '美容养颜', '延缓衰老'],
      '3C数码': ['手机', '电脑', '耳机', '相机', '智能设备', '数码', '电子', '科技', '芯片', '处理器', '内存', '存储', '屏幕', '电池', '充电', '蓝牙', 'wifi', '5g'],
      '美妆护肤': ['面膜', '精华', '口红', '粉底', '护肤品', '化妆品', '美妆', '护肤', '洁面', '爽肤水', '乳液', '面霜', '防晒', '卸妆', '彩妆', '香水'],
      '服装鞋包': ['衣服', '鞋子', '包包', '服装', '时尚', '穿搭', '上衣', '裤子', '裙子', '外套', '内衣', '运动服', '休闲装', '正装'],
      '食品饮料': ['食品', '饮料', '零食', '饮品', '美食', '茶叶', '咖啡', '果汁', '牛奶', '酸奶', '面包', '饼干', '糖果', '巧克力'],
      '家居用品': ['家具', '家电', '家居', '生活用品', '床', '沙发', '桌子', '椅子', '柜子', '灯具', '窗帘', '地毯', '厨具', '餐具'],
      '汽车用品': ['汽车', '车用', '车载', '汽配', '轮胎', '机油', '刹车', '方向盘', '座椅', '导航', '行车记录仪', '车载充电器'],
      '运动户外': ['运动', '健身', '户外', '体育', '跑步', '游泳', '瑜伽', '篮球', '足球', '羽毛球', '登山', '露营', '骑行'],
      '母婴用品': ['母婴', '婴儿', '儿童', '宝宝', '奶粉', '尿布', '玩具', '童装', '婴儿车', '安全座椅', '奶瓶', '辅食'],
      '宠物用品': ['宠物', '猫', '狗', '宠物用品', '猫粮', '狗粮', '宠物玩具', '宠物服装', '宠物窝', '牵引绳', '猫砂', '宠物零食']
    };

    const lowerText = text.toLowerCase();
    
    // 计算每个行业的匹配分数
    const scores: Record<string, number> = {};
    
    for (const [industry, words] of Object.entries(keywords)) {
      scores[industry] = words.filter(word => lowerText.includes(word)).length;
    }
    
    // 返回得分最高的行业
    const bestMatch = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
    
    return bestMatch[1] > 0 ? bestMatch[0] : '其他';
  }
}

export const aiParser = new AIParser();
