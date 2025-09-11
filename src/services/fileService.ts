import multer from 'multer';
import mammoth from 'mammoth';
// @ts-ignore
import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { aiParser } from './aiParser';

export class FileService {
  // 配置multer用于文件上传
  static getUploadMiddleware() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

    return multer({ 
      storage,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB限制
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['.txt', '.pdf', '.docx', '.doc'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('不支持的文件格式，请上传txt、pdf、docx或doc文件'));
        }
      }
    });
  }

  // 解析上传的文件内容
  static async parseFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      switch (ext) {
        case '.txt':
          return fs.readFileSync(filePath, 'utf-8');
          
        case '.pdf':
          const pdfBuffer = fs.readFileSync(filePath);
          const pdfData = await pdf(pdfBuffer);
          return pdfData.text;
          
        case '.docx':
        case '.doc':
          const docBuffer = fs.readFileSync(filePath);
          const docResult = await mammoth.extractRawText({ buffer: docBuffer });
          return docResult.value;
          
        default:
          throw new Error('不支持的文件格式');
      }
    } catch (error) {
      console.error('文件解析失败:', error);
      throw new Error('文件解析失败，请检查文件格式');
    } finally {
      // 清理临时文件
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  // 从文本内容中提取产品信息 - AI增强智能解析引擎
  static async extractProductInfo(text: string): Promise<Partial<{
    brandName: string;
    sellingPoints: string[];
    promotionInfo: string;
    industry: string;
    targetAudience: string;
    videoPurpose: string;
    platforms: string[];
    forbiddenWords: string;
  }>> {
    console.log('🤖 启动AI增强智能解析引擎');
    console.log('原始文本长度:', text.length);
    
    try {
      // 首先尝试AI解析
      console.log('🧠 尝试AI智能解析...');
      const aiResult = await aiParser.parseProductInfo(text);
      
      if (aiResult.confidence > 0.7) {
        console.log('✅ AI解析成功，置信度:', aiResult.confidence);
        return {
          brandName: aiResult.brandName,
          sellingPoints: aiResult.sellingPoints,
          promotionInfo: aiResult.discount,
          industry: aiResult.industry,
          targetAudience: aiResult.targetAudience,
          videoPurpose: aiResult.purpose,
          platforms: aiResult.platforms,
          forbiddenWords: aiResult.forbiddenWords.join(', ')
        };
      } else {
        console.log('⚠️ AI解析置信度较低，降级到传统解析');
      }
    } catch (error) {
      console.log('❌ AI解析失败，降级到传统解析:', error);
    }
    
    // 降级到传统解析引擎
    console.log('🔄 启动传统解析引擎作为备选方案');
    
    // 定义关键词映射
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

    const purposeKeywords = {
      '广告营销卖货': ['卖货', '营销', '广告', '销售', '推广', '促销', '购买'],
      '直播间引流': ['直播', '引流', '直播间', '直播带货'],
      '种草带货': ['种草', '带货', '推荐', '安利', '分享'],
      '品宣曝光机制': ['品宣', '曝光', '品牌宣传', '宣传', '知名度']
    };

    const platformKeywords = {
      '抖音': ['抖音', 'douyin', 'tiktok'],
      '快手': ['快手', 'kuaishou'],
      '小红书': ['小红书', 'xiaohongshu', 'redbook'],
      '视频号': ['视频号', '微信视频号', 'wechat'],
      'B站': ['b站', 'B站', 'bilibili', '哔哩哔哩'],
      '淘宝': ['淘宝', 'taobao', '天猫'],
      '京东': ['京东', 'jd']
    };

    // 第一步：智能分割产品信息块
    const productBlocks = this.splitProductBlocks(text);
    console.log('📦 识别到产品信息块数量:', productBlocks.length);
    
    // 第二步：选择最完整的产品信息块进行解析
    const bestBlock = this.selectBestProductBlock(productBlocks);
    console.log('🎯 选择最佳产品信息块:', bestBlock.substring(0, 100) + '...');
    
    // 第三步：使用多策略解析引擎
    const extractedInfo = this.parseWithMultiStrategy(bestBlock, industryKeywords, purposeKeywords, platformKeywords);
    
    // 第四步：智能验证和补充
    this.intelligentValidationAndCompletion(extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
    
    console.log('✅ 最终提取结果:', extractedInfo);
    return extractedInfo;
  }

  // 智能分割产品信息块
  private static splitProductBlocks(text: string): string[] {
    const blocks: string[] = [];
    
    // 按多种分隔符分割
    const separators = [
      /\n\s*测试案例\d+[：:]/g,
      /\n\s*\d+[、.]/g,
      /\n\s*[一二三四五六七八九十]+[、.]/g,
      /\n\s*[A-Za-z]\s*[、.]/g,
      /\n\s*[-*]\s*/g,
      /\n\s*品牌[：:]/g,
      /\n\s*品牌名称[：:]/g
    ];
    
    let currentText = text;
    
    // 尝试不同的分割策略
    for (const separator of separators) {
      const parts = currentText.split(separator);
      if (parts.length > 1) {
        blocks.push(...parts.filter(part => part.trim().length > 10));
        break;
      }
    }
    
    // 如果没有找到合适的分割点，尝试按段落分割
    if (blocks.length <= 1) {
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
      blocks.push(...paragraphs);
    }
    
    // 如果还是没有，返回整个文本
    if (blocks.length === 0) {
      blocks.push(text);
    }
    
    return blocks.map(block => block.trim()).filter(block => block.length > 0);
  }

  // 选择最完整的产品信息块
  private static selectBestProductBlock(blocks: string[]): string {
    if (blocks.length === 1) {
      return blocks[0];
    }
    
    let bestBlock = blocks[0];
    let maxScore = 0;
    
    for (const block of blocks) {
      let score = 0;
      
      // 计算信息完整度得分
      if (block.includes('品牌') || block.includes('品牌名称')) score += 10;
      if (block.includes('卖点') || block.includes('核心卖点')) score += 8;
      if (block.includes('行业')) score += 6;
      if (block.includes('人群') || block.includes('目标人群')) score += 5;
      if (block.includes('目的') || block.includes('视频目的')) score += 5;
      if (block.includes('平台')) score += 4;
      if (block.includes('优惠') || block.includes('活动优惠')) score += 3;
      if (block.includes('违禁词')) score += 2;
      
      // 长度加分（适中的长度更好）
      const length = block.length;
      if (length > 50 && length < 500) score += 3;
      else if (length > 500 && length < 1000) score += 2;
      else if (length > 1000) score += 1;
      
      // 品牌名称质量加分
      if (block.match(/[A-Za-z\u4e00-\u9fa5]{2,10}\s*(品牌手册|应运而生|品牌)/)) score += 5;
      
      if (score > maxScore) {
        maxScore = score;
        bestBlock = block;
      }
    }
    
    console.log('🏆 最佳信息块得分:', maxScore);
    return bestBlock;
  }

  // 多策略解析引擎
  private static parseWithMultiStrategy(
    text: string,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ): any {
    const extractedInfo: any = {};
    
    // 策略1：增强正则表达式匹配
    this.enhancedRegexExtraction(text, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
    
    // 策略2：智能行解析
    if (this.getExtractedFieldCount(extractedInfo) < 4) {
      this.smartLineParsing(text, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
    }
    
    // 策略3：上下文分析
    if (this.getExtractedFieldCount(extractedInfo) < 4) {
      this.contextualAnalysis(text, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
    }
    
    return extractedInfo;
  }

  // 增强正则表达式提取
  private static enhancedRegexExtraction(
    text: string,
    extractedInfo: any,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ) {
    console.log('🔍 执行增强正则表达式提取');
    
    // 品牌名称 - 多种模式
    const brandPatterns = [
      /(?:品牌名称|品牌)[：:]\s*([^\n\r]+?)(?=\s*(?:核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
      /(?:品牌名称|品牌)[：:]\s*([^\n\r]+)/i,
      /([A-Za-z\u4e00-\u9fa5\s]+?)\s*品牌手册/i,
      /([A-Za-z\u4e00-\u9fa5\s]+?)\s*应运而生/i,
      /([A-Za-z\u4e00-\u9fa5\s]+?)\s*诞生/i,
      /([A-Za-z\u4e00-\u9fa5\s]+?)\s*品牌/i
    ];
    
    for (const pattern of brandPatterns) {
      const match = text.match(pattern);
      if (match) {
        let brandName = match[1].trim();
        brandName = brandName.replace(/^(品牌|手册|应运而生|诞生|品牌手册)$/i, '').trim();
        if (brandName && brandName.length >= 2 && brandName.length <= 50) {
          extractedInfo.brandName = brandName;
          console.log('✅ 提取到品牌名称:', brandName);
          break;
        }
      }
    }
    
    // 卖点 - 多种模式
    const sellingPatterns = [
      /(?:核心卖点|卖点)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
      /(?:核心卖点|卖点)[：:]\s*([^\n\r]+)/i
    ];
    
    for (const pattern of sellingPatterns) {
      const match = text.match(pattern);
      if (match) {
        const points = match[1].trim();
        const parsedPoints = this.parseSellingPoints(points);
        if (parsedPoints && parsedPoints.length > 0) {
          extractedInfo.sellingPoints = parsedPoints;
          console.log('✅ 提取到卖点:', parsedPoints);
          break;
        }
      }
    }
    
    // 其他字段的提取...
    this.extractOtherFields(text, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
  }

  // 智能行解析
  private static smartLineParsing(
    text: string,
    extractedInfo: any,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ) {
    console.log('🧠 执行智能行解析');
    
    const lines = text.split(/[\n\r]+/).map(line => line.trim()).filter(line => line);
    
    for (const line of lines) {
      // 品牌名称
      if (!extractedInfo.brandName) {
        const brandMatch = line.match(/(?:品牌名称|品牌)[：:]\s*(.+)/i);
        if (brandMatch) {
          let brandName = brandMatch[1].trim();
          brandName = brandName.replace(/^(品牌|手册|应运而生|诞生|品牌手册)$/i, '').trim();
          if (brandName && brandName.length >= 2) {
            extractedInfo.brandName = brandName;
            console.log('✅ 行解析提取到品牌名称:', brandName);
          }
        }
      }
      
      // 其他字段的智能解析...
      this.parseLineForField(line, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
    }
  }

  // 上下文分析
  private static contextualAnalysis(
    text: string,
    extractedInfo: any,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ) {
    console.log('🔬 执行上下文分析');
    
    // 如果没有品牌名称，尝试从上下文推断
    if (!extractedInfo.brandName) {
      const contextBrands = this.inferBrandFromContext(text);
      if (contextBrands.length > 0) {
        extractedInfo.brandName = contextBrands[0];
        console.log('✅ 上下文推断品牌名称:', contextBrands[0]);
      }
    }
    
    // 其他字段的上下文推断...
    this.inferOtherFieldsFromContext(text, extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
  }

  // 智能验证和补充
  private static intelligentValidationAndCompletion(
    extractedInfo: any,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ) {
    console.log('🔧 执行智能验证和补充');
    
    // 验证品牌名称
    if (extractedInfo.brandName) {
      extractedInfo.brandName = this.cleanBrandName(extractedInfo.brandName);
    }
    
    // 验证卖点
    if (extractedInfo.sellingPoints) {
      extractedInfo.sellingPoints = this.validateSellingPoints(extractedInfo.sellingPoints);
    }
    
    // 补充缺失字段
    this.fillMissingFields(extractedInfo, industryKeywords, purposeKeywords, platformKeywords);
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
          let brandName = brandMatch[1].trim();
          // 清理品牌名称，移除常见的无关词汇
          brandName = brandName.replace(/^(品牌|手册|应运而生|诞生|品牌手册)$/i, '').trim();
          if (brandName && brandName.length >= 2) {
            extractedInfo.brandName = brandName;
            console.log('提取到品牌名称:', extractedInfo.brandName);
            break;
          }
        }
      }
    } else {
      const brandMatch = text.match(patterns.brandName);
      if (brandMatch) {
        let brandName = brandMatch[1].trim();
        brandName = brandName.replace(/^(品牌|手册|应运而生|诞生|品牌手册)$/i, '').trim();
        if (brandName && brandName.length >= 2) {
          extractedInfo.brandName = brandName;
          console.log('提取到品牌名称:', extractedInfo.brandName);
        }
      }
    }

    // 提取卖点 - 支持多个正则表达式
    if (Array.isArray(patterns.sellingPoints)) {
      for (const pattern of patterns.sellingPoints) {
        const sellingMatch = text.match(pattern);
        if (sellingMatch) {
          const points = sellingMatch[1].trim();
          extractedInfo.sellingPoints = this.parseSellingPoints(points);
          console.log('提取到卖点:', extractedInfo.sellingPoints);
          break;
        }
      }
    } else {
      const sellingMatch = text.match(patterns.sellingPoints);
      if (sellingMatch) {
        const points = sellingMatch[1].trim();
        extractedInfo.sellingPoints = this.parseSellingPoints(points);
        console.log('提取到卖点:', extractedInfo.sellingPoints);
      }
    }

    // 提取优惠信息 - 支持多个正则表达式
    if (Array.isArray(patterns.promotionInfo)) {
      for (const pattern of patterns.promotionInfo) {
        const promotionMatch = text.match(pattern);
        if (promotionMatch) {
          extractedInfo.promotionInfo = promotionMatch[1].trim();
          console.log('提取到优惠信息:', extractedInfo.promotionInfo);
          break;
        }
      }
    } else {
      const promotionMatch = text.match(patterns.promotionInfo);
      if (promotionMatch) {
        extractedInfo.promotionInfo = promotionMatch[1].trim();
        console.log('提取到优惠信息:', extractedInfo.promotionInfo);
      }
    }

    // 提取行业 - 支持多个正则表达式
    if (Array.isArray(patterns.industry)) {
      for (const pattern of patterns.industry) {
        const industryMatch = text.match(pattern);
        if (industryMatch) {
          const industryText = industryMatch[1].trim();
          extractedInfo.industry = this.matchIndustry(industryText, industryKeywords);
          if (extractedInfo.industry) {
            console.log('提取到行业:', extractedInfo.industry);
            break;
          }
        }
      }
    } else {
      const industryMatch = text.match(patterns.industry);
      if (industryMatch) {
        const industryText = industryMatch[1].trim();
        extractedInfo.industry = this.matchIndustry(industryText, industryKeywords);
        if (extractedInfo.industry) {
          console.log('提取到行业:', extractedInfo.industry);
        }
      }
    }

    // 提取目标人群 - 支持多个正则表达式
    if (Array.isArray(patterns.targetAudience)) {
      for (const pattern of patterns.targetAudience) {
        const audienceMatch = text.match(pattern);
        if (audienceMatch) {
          extractedInfo.targetAudience = audienceMatch[1].trim();
          console.log('提取到目标人群:', extractedInfo.targetAudience);
          break;
        }
      }
    } else {
      const audienceMatch = text.match(patterns.targetAudience);
      if (audienceMatch) {
        extractedInfo.targetAudience = audienceMatch[1].trim();
        console.log('提取到目标人群:', extractedInfo.targetAudience);
      }
    }

    // 提取视频目的 - 支持多个正则表达式
    if (Array.isArray(patterns.videoPurpose)) {
      for (const pattern of patterns.videoPurpose) {
        const purposeMatch = text.match(pattern);
        if (purposeMatch) {
          const purposeText = purposeMatch[1].trim();
          extractedInfo.videoPurpose = this.matchPurpose(purposeText, purposeKeywords);
          if (extractedInfo.videoPurpose) {
            console.log('提取到视频目的:', extractedInfo.videoPurpose);
            break;
          }
        }
      }
    } else {
      const purposeMatch = text.match(patterns.videoPurpose);
      if (purposeMatch) {
        const purposeText = purposeMatch[1].trim();
        extractedInfo.videoPurpose = this.matchPurpose(purposeText, purposeKeywords);
        if (extractedInfo.videoPurpose) {
          console.log('提取到视频目的:', extractedInfo.videoPurpose);
        }
      }
    }

    // 提取平台 - 支持多个正则表达式
    if (Array.isArray(patterns.platforms)) {
      for (const pattern of patterns.platforms) {
        const platformMatch = text.match(pattern);
        if (platformMatch) {
          const platformText = platformMatch[1].trim();
          extractedInfo.platforms = this.matchPlatforms(platformText, platformKeywords);
          if (extractedInfo.platforms && extractedInfo.platforms.length > 0) {
            console.log('提取到平台:', extractedInfo.platforms);
            break;
          }
        }
      }
    } else {
      const platformMatch = text.match(patterns.platforms);
      if (platformMatch) {
        const platformText = platformMatch[1].trim();
        extractedInfo.platforms = this.matchPlatforms(platformText, platformKeywords);
        if (extractedInfo.platforms && extractedInfo.platforms.length > 0) {
          console.log('提取到平台:', extractedInfo.platforms);
        }
      }
    }

    // 提取违禁词 - 支持多个正则表达式
    if (Array.isArray(patterns.forbiddenWords)) {
      for (const pattern of patterns.forbiddenWords) {
        const forbiddenMatch = text.match(pattern);
        if (forbiddenMatch) {
          extractedInfo.forbiddenWords = forbiddenMatch[1].trim();
          console.log('提取到违禁词:', extractedInfo.forbiddenWords);
          break;
        }
      }
    } else {
      const forbiddenMatch = text.match(patterns.forbiddenWords);
      if (forbiddenMatch) {
        extractedInfo.forbiddenWords = forbiddenMatch[1].trim();
        console.log('提取到违禁词:', extractedInfo.forbiddenWords);
      }
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
    console.log('解析卖点原始文本:', points);
    
    // 使用多种分隔符分割
    const separators = /[，,、；;]/;
    const parsedPoints = points.split(separators)
      .map(p => p.trim())
      .filter(p => {
        // 过滤掉空字符串和无关内容
        return p.length > 0 && 
               !p.match(/^(品牌|优惠|行业|人群|目的|平台|违禁词|活动|目标|视频)/) &&
               p.length <= 20; // 限制单个卖点长度
      })
      .slice(0, 3); // 最多3个卖点
    
    console.log('解析后的卖点:', parsedPoints);
    return parsedPoints;
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
    console.log('匹配平台原始文本:', text);
    
    const matchedPlatforms: string[] = [];
    
    // 使用多种分隔符分割平台文本
    const platformText = text.split(/[，,、\s]/).map(p => p.trim()).filter(p => p);
    console.log('分割后的平台文本:', platformText);
    
    for (const platform of platformText) {
      for (const [platformName, keywords] of Object.entries(platformKeywords)) {
        if ((keywords as string[]).some((keyword: string) => {
          // 更精确的匹配逻辑
          return platform.toLowerCase().includes(keyword.toLowerCase()) || 
                 keyword.toLowerCase().includes(platform.toLowerCase()) ||
                 platform === keyword;
        })) {
          if (!matchedPlatforms.includes(platformName)) {
            matchedPlatforms.push(platformName);
            console.log('匹配到平台:', platformName, '从文本:', platform);
          }
          break;
        }
      }
    }
    
    console.log('最终匹配的平台:', matchedPlatforms);
    return matchedPlatforms;
  }

  // 提取其他字段
  private static extractOtherFields(
    text: string,
    extractedInfo: any,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ) {
    // 优惠信息
    const promotionPatterns = [
      /(?:活动优惠|优惠)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|行业|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
      /(?:活动优惠|优惠)[：:]\s*([^\n\r]+)/i
    ];
    
    for (const pattern of promotionPatterns) {
      const match = text.match(pattern);
      if (match) {
        extractedInfo.promotionInfo = match[1].trim();
        console.log('✅ 提取到优惠信息:', extractedInfo.promotionInfo);
        break;
      }
    }
    
    // 行业
    const industryPatterns = [
      /行业[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|目标人群|人群|视频目的|目的|平台|违禁词|$))/i,
      /行业[：:]\s*([^\n\r]+)/i
    ];
    
    for (const pattern of industryPatterns) {
      const match = text.match(pattern);
      if (match) {
        const industryText = match[1].trim();
        const industry = this.matchIndustry(industryText, industryKeywords);
        if (industry) {
          extractedInfo.industry = industry;
          console.log('✅ 提取到行业:', industry);
          break;
        }
      }
    }
    
    // 目标人群
    const audiencePatterns = [
      /(?:目标人群|人群)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|视频目的|目的|平台|违禁词|$))/i,
      /(?:目标人群|人群)[：:]\s*([^\n\r]+)/i
    ];
    
    for (const pattern of audiencePatterns) {
      const match = text.match(pattern);
      if (match) {
        extractedInfo.targetAudience = match[1].trim();
        console.log('✅ 提取到目标人群:', extractedInfo.targetAudience);
        break;
      }
    }
    
    // 视频目的
    const purposePatterns = [
      /(?:视频目的|目的)[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|平台|违禁词|$))/i,
      /(?:视频目的|目的)[：:]\s*([^\n\r]+)/i
    ];
    
    for (const pattern of purposePatterns) {
      const match = text.match(pattern);
      if (match) {
        const purposeText = match[1].trim();
        const purpose = this.matchPurpose(purposeText, purposeKeywords);
        if (purpose) {
          extractedInfo.videoPurpose = purpose;
          console.log('✅ 提取到视频目的:', purpose);
          break;
        }
      }
    }
    
    // 平台
    const platformPatterns = [
      /平台[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|违禁词|$))/i,
      /平台[：:]\s*([^\n\r]+)/i
    ];
    
    for (const pattern of platformPatterns) {
      const match = text.match(pattern);
      if (match) {
        const platformText = match[1].trim();
        const platforms = this.matchPlatforms(platformText, platformKeywords);
        if (platforms && platforms.length > 0) {
          extractedInfo.platforms = platforms;
          console.log('✅ 提取到平台:', platforms);
          break;
        }
      }
    }
    
    // 违禁词
    const forbiddenPatterns = [
      /违禁词[：:]\s*([^\n\r]+?)(?=\s*(?:品牌|核心卖点|卖点|活动优惠|优惠|行业|目标人群|人群|视频目的|目的|平台|$))/i,
      /违禁词[：:]\s*([^\n\r]+)/i
    ];
    
    for (const pattern of forbiddenPatterns) {
      const match = text.match(pattern);
      if (match) {
        extractedInfo.forbiddenWords = match[1].trim();
        console.log('✅ 提取到违禁词:', extractedInfo.forbiddenWords);
        break;
      }
    }
  }

  // 解析行中的字段
  private static parseLineForField(
    line: string,
    extractedInfo: any,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ) {
    // 卖点
    if ((line.includes('卖点') || line.includes('核心卖点')) && !extractedInfo.sellingPoints) {
      const match = line.match(/(?:核心卖点|卖点)[：:]\s*(.+)/i);
      if (match) {
        const points = match[1].trim();
        const parsedPoints = this.parseSellingPoints(points);
        if (parsedPoints && parsedPoints.length > 0) {
          extractedInfo.sellingPoints = parsedPoints;
          console.log('✅ 行解析提取到卖点:', parsedPoints);
        }
      }
    }
    
    // 优惠信息
    if ((line.includes('优惠') || line.includes('活动优惠')) && !extractedInfo.promotionInfo) {
      const match = line.match(/(?:活动优惠|优惠)[：:]\s*(.+)/i);
      if (match) {
        extractedInfo.promotionInfo = match[1].trim();
        console.log('✅ 行解析提取到优惠信息:', extractedInfo.promotionInfo);
      }
    }
    
    // 行业
    if (line.includes('行业') && !extractedInfo.industry) {
      const match = line.match(/行业[：:]\s*(.+)/i);
      if (match) {
        const industryText = match[1].trim();
        const industry = this.matchIndustry(industryText, industryKeywords);
        if (industry) {
          extractedInfo.industry = industry;
          console.log('✅ 行解析提取到行业:', industry);
        }
      }
    }
    
    // 目标人群
    if ((line.includes('人群') || line.includes('目标人群')) && !extractedInfo.targetAudience) {
      const match = line.match(/(?:目标人群|人群)[：:]\s*(.+)/i);
      if (match) {
        extractedInfo.targetAudience = match[1].trim();
        console.log('✅ 行解析提取到目标人群:', extractedInfo.targetAudience);
      }
    }
    
    // 视频目的
    if ((line.includes('目的') || line.includes('视频目的')) && !extractedInfo.videoPurpose) {
      const match = line.match(/(?:视频目的|目的)[：:]\s*(.+)/i);
      if (match) {
        const purposeText = match[1].trim();
        const purpose = this.matchPurpose(purposeText, purposeKeywords);
        if (purpose) {
          extractedInfo.videoPurpose = purpose;
          console.log('✅ 行解析提取到视频目的:', purpose);
        }
      }
    }
    
    // 平台
    if (line.includes('平台') && !extractedInfo.platforms) {
      const match = line.match(/平台[：:]\s*(.+)/i);
      if (match) {
        const platformText = match[1].trim();
        const platforms = this.matchPlatforms(platformText, platformKeywords);
        if (platforms && platforms.length > 0) {
          extractedInfo.platforms = platforms;
          console.log('✅ 行解析提取到平台:', platforms);
        }
      }
    }
    
    // 违禁词
    if (line.includes('违禁词') && !extractedInfo.forbiddenWords) {
      const match = line.match(/违禁词[：:]\s*(.+)/i);
      if (match) {
        extractedInfo.forbiddenWords = match[1].trim();
        console.log('✅ 行解析提取到违禁词:', extractedInfo.forbiddenWords);
      }
    }
  }

  // 从上下文推断品牌
  private static inferBrandFromContext(text: string): string[] {
    const brands: string[] = [];
    
    // 常见的品牌模式
    const brandPatterns = [
      /([A-Za-z\u4e00-\u9fa5]+(?:iPhone|华为|小米|OPPO|vivo|三星|苹果|华为|荣耀|一加|realme|iQOO))/i,
      /([A-Za-z\u4e00-\u9fa5]+(?:手机|电脑|平板|耳机))/i,
      /([A-Za-z\u4e00-\u9fa5]{2,8})\s*品牌手册/i,
      /([A-Za-z\u4e00-\u9fa5]{2,8})\s*应运而生/i,
      /([A-Za-z\u4e00-\u9fa5]{2,8})\s*诞生/i,
      /([A-Za-z\u4e00-\u9fa5]{2,8})\s*品牌/i
    ];
    
    for (const pattern of brandPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const brand = match[1].trim();
        if (brand && brand.length >= 2 && brand.length <= 50 && !brands.includes(brand)) {
          brands.push(brand);
        }
      }
    }
    
    return brands;
  }

  // 从上下文推断其他字段
  private static inferOtherFieldsFromContext(
    text: string,
    extractedInfo: any,
    industryKeywords: any,
    purposeKeywords: any,
    platformKeywords: any
  ) {
    // 推断行业
    if (!extractedInfo.industry) {
      const industry = this.matchIndustry(text, industryKeywords);
      if (industry) {
        extractedInfo.industry = industry;
        console.log('✅ 上下文推断行业:', industry);
      }
    }
    
    // 推断视频目的
    if (!extractedInfo.videoPurpose) {
      const purpose = this.matchPurpose(text, purposeKeywords);
      if (purpose) {
        extractedInfo.videoPurpose = purpose;
        console.log('✅ 上下文推断视频目的:', purpose);
      }
    }
    
    // 推断平台
    if (!extractedInfo.platforms) {
      const platforms = this.matchPlatforms(text, platformKeywords);
      if (platforms && platforms.length > 0) {
        extractedInfo.platforms = platforms;
        console.log('✅ 上下文推断平台:', platforms);
      }
    }
  }

  // 清理品牌名称
  private static cleanBrandName(brandName: string): string {
    return brandName
      .replace(/^(品牌|手册|应运而生|诞生|品牌手册)$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 验证卖点
  private static validateSellingPoints(sellingPoints: string[]): string[] {
    return sellingPoints
      .filter(point => point && point.trim().length > 0 && point.length <= 20)
      .map(point => point.trim())
      .slice(0, 3);
  }

  // 填充缺失字段
  private static fillMissingFields(
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

  // 获取已提取字段数量
  private static getExtractedFieldCount(extractedInfo: any): number {
    return Object.values(extractedInfo).filter(value => 
      value !== undefined && value !== null && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  }

}
