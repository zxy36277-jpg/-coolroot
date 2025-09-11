import { VercelRequest, VercelResponse } from '@vercel/node';

// AI解析器 - 适配Vercel环境
class VercelAIParser {
  private readonly apiKey = 'sk-295761577e304806a3c5c17b0064d11c';
  private readonly apiUrl = 'https://api.deepseek.com/chat/completions';

  async parseProductInfo(text: string): Promise<{
    brandName: string;
    sellingPoints: string[];
    industry: string;
    targetAudience: string;
    videoPurpose: string;
    platforms: string[];
    promotionInfo: string;
    forbiddenWords: string[];
    confidence: number;
  }> {
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
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API调用失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private parseAIResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法从AI响应中提取JSON');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      return {
        brandName: this.validateString(result.brandName, '品牌名称'),
        sellingPoints: this.validateArray(result.sellingPoints, '卖点'),
        industry: this.validateString(result.industry, '行业'),
        targetAudience: this.validateString(result.targetAudience, '目标人群'),
        videoPurpose: this.validateString(result.purpose, '营销目的'),
        platforms: this.validateArray(result.platforms, '平台'),
        promotionInfo: this.validateString(result.discount, '优惠信息'),
        forbiddenWords: this.validateArray(result.forbiddenWords, '违禁词'),
        confidence: Math.min(Math.max(result.confidence || 0.8, 0), 1)
      };
    } catch (error) {
      console.error('AI响应解析失败:', error);
      throw new Error('AI响应格式错误');
    }
  }

  private validateString(value: any, fieldName: string): string {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    return this.getDefaultValue(fieldName);
  }

  private validateArray(value: any, fieldName: string): string[] {
    if (Array.isArray(value) && value.length > 0) {
      return value.filter(item => typeof item === 'string' && item.trim()).slice(0, 3);
    }
    return this.getDefaultArray(fieldName);
  }

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

  private getDefaultArray(fieldName: string): string[] {
    const defaults: Record<string, string[]> = {
      '卖点': ['优质产品', '值得信赖'],
      '平台': ['抖音', '快手'],
      '违禁词': []
    };
    return defaults[fieldName] || [];
  }

  private fallbackParsing(text: string): any {
    console.log('🔄 降级到传统解析...');
    
    const industry = this.detectIndustryByKeywords(text);
    
    return {
      brandName: '未知品牌',
      sellingPoints: ['优质产品'],
      industry,
      targetAudience: '通用人群',
      videoPurpose: '产品推广',
      platforms: ['抖音', '快手'],
      promotionInfo: '无',
      forbiddenWords: [],
      confidence: 0.3
    };
  }

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

// 文件解析服务 - 适配Vercel环境
class VercelFileService {
  // 从文本内容中提取产品信息
  static extractProductInfo(text: string): Partial<{
    brandName: string;
    sellingPoints: string[];
    promotionInfo: string;
    industry: string;
    targetAudience: string;
    videoPurpose: string;
    platforms: string[];
    forbiddenWords: string;
  }> {
    const extractedInfo: any = {};

    // 保持原始文本格式，只移除首尾空白
    const cleanText = text.trim();
    const lines = cleanText.split(/[\n\r]+/).map(line => line.trim()).filter(line => line);
    
    console.log('开始解析文本内容，共', lines.length, '行');
    
    // 定义行业关键词映射
    const industryKeywords = {
      '服装': ['服装', '衣服', '服饰', '时装', '穿搭', '时尚', '女装', '男装', '童装'],
      '美妆护肤': ['美妆', '护肤', '化妆品', '护肤品', '彩妆', '美容', '面膜', '口红', '粉底'],
      '3c数码': ['数码', '3c', '手机', '电脑', '电子', '数码产品', '平板', '耳机', '充电器'],
      '家居家纺': ['家居', '家纺', '家具', '床上用品', '家装', '沙发', '床垫', '窗帘'],
      '食品': ['食品', '零食', '美食', '饮料', '食品饮料', '坚果', '饼干', '糖果'],
      '保健品': ['保健品', '营养品', '健康', '养生', '维生素', '蛋白粉', '钙片'],
      '个护百货': ['个护', '百货', '日用品', '洗护', '洗发水', '沐浴露', '牙膏'],
      '大小家电': ['家电', '电器', '小家电', '大家电', '冰箱', '洗衣机', '空调'],
      '内衣内裤': ['内衣', '内裤', '文胸', '内衣服装', '胸罩', '内裤', '睡衣'],
      '鞋服箱包': ['鞋子', '箱包', '包包', '鞋服', '运动鞋', '皮鞋', '背包']
    };

    // 定义视频目的关键词映射
    const purposeKeywords = {
      '广告营销卖货': ['卖货', '营销', '广告', '销售', '推广', '促销', '购买'],
      '直播间引流': ['直播', '引流', '直播间', '直播带货'],
      '种草带货': ['种草', '带货', '推荐', '安利', '分享'],
      '品宣曝光机制': ['品宣', '曝光', '品牌宣传', '宣传', '知名度']
    };

    // 定义平台关键词映射
    const platformKeywords = {
      '抖音': ['抖音', 'douyin', 'tiktok'],
      '快手': ['快手', 'kuaishou'],
      '小红书': ['小红书', 'xiaohongshu', 'redbook'],
      '视频号': ['视频号', '微信视频号', 'wechat'],
      'B站': ['b站', 'B站', 'bilibili', '哔哩哔哩'],
      '淘宝': ['淘宝', 'taobao', '天猫'],
      '京东': ['京东', 'jd']
    };

    // 使用更灵活的正则表达式匹配，支持多种格式
    const patterns = {
      brandName: [
        /(?:品牌名称|品牌)[：:]\s*([^\n\r]+?)(?=\s*(?:核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
        /(?:品牌名称|品牌)[：:]\s*([^\n\r]+)/i,
        /([A-Za-z\u4e00-\u9fa5]+)\s*品牌手册/i,
        /([A-Za-z\u4e00-\u9fa5]+)\s*品\s*牌\s*手\s*册/i,
        /([A-Za-z\u4e00-\u9fa5]+)\s*应运而生/i
      ],
      sellingPoints: /(?:核心卖点|卖点)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
      promotionInfo: /(?:活动优惠|优惠)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|行业|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
      industry: /行业[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
      targetAudience: /(?:目标人群|人群)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|视频目的|目的|平台|违禁词|$))/i,
      videoPurpose: /(?:视频目的|目的)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|平台|违禁词|$))/i,
      platforms: /平台[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|违禁词|$))/i,
      forbiddenWords: /违禁词[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|平台|$))/i
    };

    // 首先尝试使用正则表达式匹配
    this.extractWithPatterns(cleanText, patterns, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);

    // 如果正则匹配结果不完整，使用逐行解析
    if (this.getExtractedFieldCount(extractedInfo) < 4) {
      console.log('正则匹配结果不完整，使用逐行解析');
      this.extractLineByLine(lines, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
    }

    // 如果仍然不完整，使用智能文本分析
    if (this.getExtractedFieldCount(extractedInfo) < 4) {
      console.log('逐行解析结果不完整，使用智能文本分析');
      this.extractWithSmartAnalysis(cleanText, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
    }

    // 验证和补充必要字段
    this.validateAndCompleteFields(extractedInfo, industryKeywords, purposeKeywords, platformKeywords);

    console.log('最终提取结果:', extractedInfo);
    return extractedInfo;
  }

  // 使用正则表达式提取信息
  private static extractWithPatterns(
    text: string, 
    patterns: any, 
    extractedInfo: any, 
    industryKeywords: any, 
    purposeKeywords: any, 
    platformKeywords: any
  ) {
    // 提取品牌名称 - 支持多个正则表达式
    if (Array.isArray(patterns.brandName)) {
      for (const pattern of patterns.brandName) {
        const brandMatch = text.match(pattern);
        if (brandMatch) {
          extractedInfo.brandName = brandMatch[1].trim();
          console.log('提取到品牌名称:', extractedInfo.brandName);
          break;
        }
      }
    } else {
      const brandMatch = text.match(patterns.brandName);
      if (brandMatch) {
        extractedInfo.brandName = brandMatch[1].trim();
        console.log('提取到品牌名称:', extractedInfo.brandName);
      }
    }

    // 提取卖点
    const sellingMatch = text.match(patterns.sellingPoints);
    if (sellingMatch) {
      const points = sellingMatch[1].trim();
      extractedInfo.sellingPoints = this.parseSellingPoints(points);
      console.log('提取到卖点:', extractedInfo.sellingPoints);
    }

    // 提取优惠信息
    const promotionMatch = text.match(patterns.promotionInfo);
    if (promotionMatch) {
      extractedInfo.promotionInfo = promotionMatch[1].trim();
      console.log('提取到优惠信息:', extractedInfo.promotionInfo);
    }

    // 提取行业
    const industryMatch = text.match(patterns.industry);
    if (industryMatch) {
      const industryText = industryMatch[1].trim();
      extractedInfo.industry = this.matchIndustry(industryText, industryKeywords);
      if (extractedInfo.industry) {
        console.log('提取到行业:', extractedInfo.industry);
      }
    }

    // 提取目标人群
    const audienceMatch = text.match(patterns.targetAudience);
    if (audienceMatch) {
      extractedInfo.targetAudience = audienceMatch[1].trim();
      console.log('提取到目标人群:', extractedInfo.targetAudience);
    }

    // 提取视频目的
    const purposeMatch = text.match(patterns.videoPurpose);
    if (purposeMatch) {
      const purposeText = purposeMatch[1].trim();
      extractedInfo.videoPurpose = this.matchPurpose(purposeText, purposeKeywords);
      if (extractedInfo.videoPurpose) {
        console.log('提取到视频目的:', extractedInfo.videoPurpose);
      }
    }

    // 提取平台
    const platformMatch = text.match(patterns.platforms);
    if (platformMatch) {
      const platformText = platformMatch[1].trim();
      extractedInfo.platforms = this.matchPlatforms(platformText, platformKeywords);
      if (extractedInfo.platforms && extractedInfo.platforms.length > 0) {
        console.log('提取到平台:', extractedInfo.platforms);
      }
    }

    // 提取违禁词
    const forbiddenMatch = text.match(patterns.forbiddenWords);
    if (forbiddenMatch) {
      extractedInfo.forbiddenWords = forbiddenMatch[1].trim();
      console.log('提取到违禁词:', extractedInfo.forbiddenWords);
    }
  }

  // 逐行解析
  private static extractLineByLine(
    lines: string[], 
    extractedInfo: any, 
    industryKeywords: any, 
    purposeKeywords: any, 
    platformKeywords: any
  ) {
    for (const line of lines) {
      console.log('解析第' + (lines.indexOf(line) + 1) + '行:', line);
      
      // 品牌名称 - 改进识别逻辑
      if (!extractedInfo.brandName) {
        // 匹配 "品牌名称：" 或 "品牌：" 格式
        let match = line.match(/(?:品牌名称|品牌)[：:]\s*(.+)/i);
        if (match) {
          extractedInfo.brandName = match[1].trim();
          console.log('提取到品牌名称:', extractedInfo.brandName);
        } else {
          // 匹配 "品牌手册" 格式
          match = line.match(/([A-Za-z\u4e00-\u9fa5]+)\s*品牌手册/i);
          if (match) {
            extractedInfo.brandName = match[1].trim();
            console.log('提取到品牌名称:', extractedInfo.brandName);
          } else {
            // 匹配 "品牌手册" 格式（带空格）
            match = line.match(/([A-Za-z\u4e00-\u9fa5]+)\s*品\s*牌\s*手\s*册/i);
            if (match) {
              extractedInfo.brandName = match[1].trim();
              console.log('提取到品牌名称:', extractedInfo.brandName);
            } else {
              // 匹配 "应运而生" 格式
              match = line.match(/([A-Za-z\u4e00-\u9fa5]+)\s*应运而生/i);
              if (match) {
                extractedInfo.brandName = match[1].trim();
                console.log('提取到品牌名称:', extractedInfo.brandName);
              }
            }
          }
        }
      }
      
      // 卖点
      if ((line.includes('卖点') || line.includes('核心卖点')) && !extractedInfo.sellingPoints) {
        const match = line.match(/(?:核心卖点|卖点)[：:]\s*(.+)/i);
        if (match) {
          const points = match[1].trim();
          extractedInfo.sellingPoints = this.parseSellingPoints(points);
          console.log('提取到卖点:', extractedInfo.sellingPoints);
        }
      }
      
      // 优惠信息
      if ((line.includes('优惠') || line.includes('活动优惠')) && !extractedInfo.promotionInfo) {
        const match = line.match(/(?:活动优惠|优惠)[：:]\s*(.+)/i);
        if (match) {
          extractedInfo.promotionInfo = match[1].trim();
          console.log('提取到优惠信息:', extractedInfo.promotionInfo);
        }
      }
      
      // 行业
      if (line.includes('行业') && !extractedInfo.industry) {
        const match = line.match(/行业[：:]\s*(.+)/i);
        if (match) {
          const industryText = match[1].trim();
          extractedInfo.industry = this.matchIndustry(industryText, industryKeywords);
          if (extractedInfo.industry) {
            console.log('提取到行业:', extractedInfo.industry);
          }
        }
      }
      
      // 目标人群
      if ((line.includes('人群') || line.includes('目标人群')) && !extractedInfo.targetAudience) {
        const match = line.match(/(?:目标人群|人群)[：:]\s*(.+)/i);
        if (match) {
          extractedInfo.targetAudience = match[1].trim();
          console.log('提取到目标人群:', extractedInfo.targetAudience);
        }
      }
      
      // 视频目的
      if ((line.includes('目的') || line.includes('视频目的')) && !extractedInfo.videoPurpose) {
        const match = line.match(/(?:视频目的|目的)[：:]\s*(.+)/i);
        if (match) {
          const purposeText = match[1].trim();
          extractedInfo.videoPurpose = this.matchPurpose(purposeText, purposeKeywords);
          if (extractedInfo.videoPurpose) {
            console.log('提取到视频目的:', extractedInfo.videoPurpose);
          }
        }
      }
      
      // 平台
      if (line.includes('平台') && !extractedInfo.platforms) {
        const match = line.match(/平台[：:]\s*(.+)/i);
        if (match) {
          const platformText = match[1].trim();
          extractedInfo.platforms = this.matchPlatforms(platformText, platformKeywords);
          if (extractedInfo.platforms && extractedInfo.platforms.length > 0) {
            console.log('提取到平台:', extractedInfo.platforms);
          }
        }
      }
      
      // 违禁词
      if (line.includes('违禁词') && !extractedInfo.forbiddenWords) {
        const match = line.match(/违禁词[：:]\s*(.+)/i);
        if (match) {
          extractedInfo.forbiddenWords = match[1].trim();
          console.log('提取到违禁词:', extractedInfo.forbiddenWords);
        }
      }
    }
  }

  // 智能文本分析
  private static extractWithSmartAnalysis(
    text: string, 
    extractedInfo: any, 
    industryKeywords: any, 
    purposeKeywords: any, 
    platformKeywords: any
  ) {
    // 对于长文档，只处理前1000个字符以提高效率
    const searchText = text.length > 1000 ? text.substring(0, 1000) : text;
    
    // 如果没有品牌名称，尝试从文本中推断
    if (!extractedInfo.brandName) {
      const brandPatterns = [
        /(?:品牌名称|品牌)[：:]\s*([^\n\r]+)/i,
        /([A-Za-z\u4e00-\u9fa5]+(?:iPhone|华为|小米|OPPO|vivo|三星|苹果))/i,
        /([A-Za-z\u4e00-\u9fa5]+(?:手机|电脑|平板|耳机))/i,
        // 新增：识别品牌手册中的品牌名称
        /([A-Za-z\u4e00-\u9fa5]+)\s*品牌手册/i,
        /([A-Za-z\u4e00-\u9fa5]+)\s*品\s*牌\s*手\s*册/i,
        // 新增：识别常见的品牌名称模式
        /([A-Za-z\u4e00-\u9fa5]{2,8})\s*应运而生/i,
        /([A-Za-z\u4e00-\u9fa5]{2,8})\s*诞生/i,
        /([A-Za-z\u4e00-\u9fa5]{2,8})\s*品牌/i,
        // 新增：识别英文+中文品牌名
        /([A-Za-z]+[A-Za-z\u4e00-\u9fa5]+)/i
      ];
      
      for (const pattern of brandPatterns) {
        const match = searchText.match(pattern);
        if (match) {
          let brandName = match[1].trim();
          // 清理品牌名称，移除常见的无关词汇
          brandName = brandName.replace(/^(品牌|手册|应运而生|诞生|品牌手册)$/i, '');
          if (brandName && brandName.length >= 2) {
            extractedInfo.brandName = brandName;
            console.log('智能推断品牌名称:', extractedInfo.brandName);
            break;
          }
        }
      }
    }

    // 如果没有行业，尝试从文本中推断
    if (!extractedInfo.industry) {
      extractedInfo.industry = this.matchIndustry(searchText, industryKeywords);
      if (extractedInfo.industry) {
        console.log('智能推断行业:', extractedInfo.industry);
      }
    }

    // 如果没有视频目的，尝试从文本中推断
    if (!extractedInfo.videoPurpose) {
      extractedInfo.videoPurpose = this.matchPurpose(searchText, purposeKeywords);
      if (extractedInfo.videoPurpose) {
        console.log('智能推断视频目的:', extractedInfo.videoPurpose);
      }
    }

    // 如果没有平台，尝试从文本中推断
    if (!extractedInfo.platforms) {
      extractedInfo.platforms = this.matchPlatforms(searchText, platformKeywords);
      if (extractedInfo.platforms && extractedInfo.platforms.length > 0) {
        console.log('智能推断平台:', extractedInfo.platforms);
      }
    }
  }

  // 验证和补充必要字段
  private static validateAndCompleteFields(
    extractedInfo: any, 
    industryKeywords: any, 
    purposeKeywords: any, 
    platformKeywords: any
  ) {
    // 确保卖点数量在1-3个之间
    if (extractedInfo.sellingPoints && extractedInfo.sellingPoints.length > 3) {
      extractedInfo.sellingPoints = extractedInfo.sellingPoints.slice(0, 3);
    }

    // 如果没有卖点，提供默认值
    if (!extractedInfo.sellingPoints || extractedInfo.sellingPoints.length === 0) {
      extractedInfo.sellingPoints = ['高性能', '优质材料', '性价比高'];
    }

    // 如果没有行业，提供默认值
    if (!extractedInfo.industry) {
      extractedInfo.industry = '3c数码';
    }

    // 如果没有视频目的，提供默认值
    if (!extractedInfo.videoPurpose) {
      extractedInfo.videoPurpose = '广告营销卖货';
    }

    // 如果没有平台，提供默认值
    if (!extractedInfo.platforms || extractedInfo.platforms.length === 0) {
      extractedInfo.platforms = ['抖音', '小红书'];
    }

    // 如果没有目标人群，提供默认值
    if (!extractedInfo.targetAudience) {
      extractedInfo.targetAudience = '25-35岁用户';
    }

    // 如果没有优惠信息，提供默认值
    if (!extractedInfo.promotionInfo) {
      extractedInfo.promotionInfo = '限时优惠，欢迎咨询';
    }

    // 如果没有违禁词，提供默认值
    if (!extractedInfo.forbiddenWords) {
      extractedInfo.forbiddenWords = '最好，第一，绝对';
    }
  }

  // 解析卖点
  private static parseSellingPoints(points: string): string[] {
    return points.split(/[，,、；;]/)
      .map(p => p.trim())
      .filter(p => p.length > 0 && !p.match(/^(品牌|优惠|行业|人群|目的|平台|违禁词)/))
      .slice(0, 3); // 最多3个卖点
  }

  // 匹配行业
  private static matchIndustry(text: string, industryKeywords: any): string | null {
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if ((keywords as string[]).some((keyword: string) => text.includes(keyword))) {
        return industry;
      }
    }
    return null;
  }

  // 匹配视频目的
  private static matchPurpose(text: string, purposeKeywords: any): string | null {
    for (const [purpose, keywords] of Object.entries(purposeKeywords)) {
      if ((keywords as string[]).some((keyword: string) => text.includes(keyword))) {
        return purpose;
      }
    }
    return null;
  }

  // 匹配平台
  private static matchPlatforms(text: string, platformKeywords: any): string[] {
    const matchedPlatforms: string[] = [];
    const platformText = text.split(/[，,、\s]/).map(p => p.trim()).filter(p => p);
    
    for (const platform of platformText) {
      for (const [platformName, keywords] of Object.entries(platformKeywords)) {
        if ((keywords as string[]).some((keyword: string) => platform.includes(keyword) || keyword.includes(platform))) {
          if (!matchedPlatforms.includes(platformName)) {
            matchedPlatforms.push(platformName);
          }
          break;
        }
      }
    }
    
    return matchedPlatforms;
  }

  // 获取已提取字段数量
  private static getExtractedFieldCount(extractedInfo: any): number {
    return Object.values(extractedInfo).filter(value => 
      value !== undefined && value !== null && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      let textContent = '';
      
      // 检查Content-Type来确定如何处理请求
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        // 处理文件上传
        console.log('处理文件上传请求');
        console.log('请求体类型:', typeof req.body);
        console.log('请求体键:', Object.keys(req.body || {}));
        
        // 尝试多种方式获取文件内容
        let fileContent = null;
        
        // 方式1: 直接检查req.body.file
        if (req.body && req.body.file) {
          console.log('找到文件字段:', typeof req.body.file);
          fileContent = req.body.file;
        }
        
        // 方式2: 检查其他可能的字段名
        if (!fileContent && req.body) {
          for (const key of Object.keys(req.body)) {
            if (key.toLowerCase().includes('file') || key.toLowerCase().includes('upload')) {
              console.log('找到可能的文件字段:', key, typeof req.body[key]);
              fileContent = req.body[key];
              break;
            }
          }
        }
        
        // 方式3: 检查原始请求体
        if (!fileContent && req.body && typeof req.body === 'string') {
          console.log('请求体是字符串，尝试解析');
          fileContent = req.body;
        }
        
        if (fileContent) {
          // 处理文件内容
          if (typeof fileContent === 'string') {
            textContent = fileContent;
            console.log('从字符串提取内容，长度:', textContent.length);
          } else if (fileContent.buffer) {
            textContent = fileContent.buffer.toString('utf-8');
            console.log('从Buffer提取内容，长度:', textContent.length);
          } else if (fileContent.data) {
            textContent = fileContent.data.toString('utf-8');
            console.log('从data提取内容，长度:', textContent.length);
          } else if (fileContent.content) {
            textContent = fileContent.content;
            console.log('从content提取内容，长度:', textContent.length);
          } else {
            // 尝试转换为字符串
            try {
              textContent = String(fileContent);
              console.log('转换为字符串，长度:', textContent.length);
            } catch (e) {
              console.log('无法转换文件内容:', e);
            }
          }
          
          if (textContent && textContent.trim()) {
            console.log('成功提取文件内容');
          } else {
            console.log('提取的文件内容为空');
          }
        } else {
          console.log('未找到文件内容，返回模拟数据');
          // 如果没有文件，返回模拟数据
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
      } else if (contentType.includes('text/plain')) {
        // 处理纯文本内容
        if (req.body && typeof req.body === 'string') {
          textContent = req.body;
          console.log('接收到文本内容:', textContent);
        }
      } else {
        // 默认处理JSON或其他格式
        if (req.body && typeof req.body === 'string') {
          textContent = req.body;
        } else if (req.body && req.body.content) {
          textContent = req.body.content;
        }
      }
      
      // 如果没有获取到文本内容，返回模拟数据
      if (!textContent || textContent.trim() === '') {
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

      // 使用AI解析器提取产品信息
      const aiParser = new VercelAIParser();
      let extractedInfo;
      
      try {
        console.log('🤖 尝试AI智能解析...');
        const aiResult = await aiParser.parseProductInfo(textContent);
        
        if (aiResult.confidence > 0.7) {
          console.log('✅ AI解析成功，置信度:', aiResult.confidence);
          extractedInfo = {
            brandName: aiResult.brandName,
            sellingPoints: aiResult.sellingPoints,
            promotionInfo: aiResult.promotionInfo,
            industry: aiResult.industry,
            targetAudience: aiResult.targetAudience,
            videoPurpose: aiResult.videoPurpose,
            platforms: aiResult.platforms,
            forbiddenWords: Array.isArray(aiResult.forbiddenWords) ? aiResult.forbiddenWords.join(', ') : aiResult.forbiddenWords
          };
        } else {
          console.log('⚠️ AI解析置信度较低，降级到传统解析');
          extractedInfo = VercelFileService.extractProductInfo(textContent);
        }
      } catch (error) {
        console.log('❌ AI解析失败，降级到传统解析:', error);
        extractedInfo = VercelFileService.extractProductInfo(textContent);
      }
      
      res.status(200).json({ 
        success: true, 
        data: { 
          content: textContent,
          extractedInfo: extractedInfo
        },
        confidence: aiResult?.confidence || 0.8
      });
      return;
    }

    res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });

  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ 
      success: false,
      error: '服务器内部错误' 
    });
  }
}