import { VercelRequest, VercelResponse } from '@vercel/node';

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
      // 处理文本内容（从请求体获取）
      let textContent = '';
      
      if (req.body && typeof req.body === 'string') {
        // 如果有文本内容，直接使用
        textContent = req.body;
        console.log('接收到文本内容:', textContent);
      } else {
        // 如果没有内容，返回模拟数据用于测试
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

      // 使用文件服务提取产品信息
      const extractedInfo = VercelFileService.extractProductInfo(textContent);
      
      res.status(200).json({ 
        success: true, 
        data: { 
          content: textContent,
          extractedInfo: extractedInfo
        } 
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