import axios from 'axios';
import { config } from '../config/config';
import { ProductInfo, ScriptContent, ScriptTemplateType } from '../types';

export class AIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = config.deepseekApiKey;
    this.apiUrl = config.deepseekApiUrl;
  }

  // 生成脚本的提示词模板
  private getScriptPrompt(productInfo: ProductInfo, templateType: ScriptTemplateType): string {
    const templates = {
      problem_solution: `
        请为${productInfo.industry}行业的产品生成一个"问题解决型"短视频脚本。
        产品信息：
        - 品牌：${productInfo.brandName}
        - 核心卖点：${productInfo.sellingPoints.join('、')}
        - 活动优惠：${productInfo.promotionInfo}
        - 目标人群：${productInfo.targetAudience}
        - 视频目的：${productInfo.videoPurpose}
        - 违禁词：${productInfo.forbiddenWords}

        请按以下格式输出：
        标题：[吸引人的标题，突出解决用户痛点]
        封面建议：[具体的封面设计建议]
        黄金3s钩子：[前3秒抓住用户注意力的开场]
        内容文案：[15-60秒的完整文案，包含产品介绍、卖点展示、优惠信息]
        拍摄建议：[远景+近景+产品细节的拍摄指导]
        爆款属性：ARPU 1.5万-2万，CTR 6%-7%，适配10-60s短视频
      `,
      product_showcase: `
        请为${productInfo.industry}行业的产品生成一个"产品展示型"短视频脚本。
        产品信息：
        - 品牌：${productInfo.brandName}
        - 核心卖点：${productInfo.sellingPoints.join('、')}
        - 活动优惠：${productInfo.promotionInfo}
        - 目标人群：${productInfo.targetAudience}
        - 视频目的：${productInfo.videoPurpose}
        - 违禁词：${productInfo.forbiddenWords}

        请按以下格式输出：
        标题：[突出产品特色的标题]
        封面建议：[展示产品亮点的封面设计]
        黄金3s钩子：[快速展示产品核心价值的开场]
        内容文案：[15-60秒的产品展示文案，重点突出卖点]
        拍摄建议：[多角度产品展示的拍摄指导]
        爆款属性：ARPU 1.5万-2万，CTR 6%-7%，适配10-60s短视频
      `,
      story_telling: `
        请为${productInfo.industry}行业的产品生成一个"故事叙述型"短视频脚本。
        产品信息：
        - 品牌：${productInfo.brandName}
        - 核心卖点：${productInfo.sellingPoints.join('、')}
        - 活动优惠：${productInfo.promotionInfo}
        - 目标人群：${productInfo.targetAudience}
        - 视频目的：${productInfo.videoPurpose}
        - 违禁词：${productInfo.forbiddenWords}

        请按以下格式输出：
        标题：[有故事感的标题]
        封面建议：[营造故事氛围的封面设计]
        黄金3s钩子：[引人入胜的故事开场]
        内容文案：[15-60秒的故事化产品介绍]
        拍摄建议：[故事化场景的拍摄指导]
        爆款属性：ARPU 1.5万-2万，CTR 6%-7%，适配10-60s短视频
      `,
      comparison: `
        请为${productInfo.industry}行业的产品生成一个"对比测评型"短视频脚本。
        产品信息：
        - 品牌：${productInfo.brandName}
        - 核心卖点：${productInfo.sellingPoints.join('、')}
        - 活动优惠：${productInfo.promotionInfo}
        - 目标人群：${productInfo.targetAudience}
        - 视频目的：${productInfo.videoPurpose}
        - 违禁词：${productInfo.forbiddenWords}

        请按以下格式输出：
        标题：[突出对比优势的标题]
        封面建议：[对比展示的封面设计]
        黄金3s钩子：[快速展示对比结果的开场]
        内容文案：[15-60秒的对比测评文案]
        拍摄建议：[对比展示的拍摄指导]
        爆款属性：ARPU 1.5万-2万，CTR 6%-7%，适配10-60s短视频
      `,
      tutorial: `
        请为${productInfo.industry}行业的产品生成一个"教程教学型"短视频脚本。
        产品信息：
        - 品牌：${productInfo.brandName}
        - 核心卖点：${productInfo.sellingPoints.join('、')}
        - 活动优惠：${productInfo.promotionInfo}
        - 目标人群：${productInfo.targetAudience}
        - 视频目的：${productInfo.videoPurpose}
        - 违禁词：${productInfo.forbiddenWords}

        请按以下格式输出：
        标题：[实用教程类标题]
        封面建议：[教学场景的封面设计]
        黄金3s钩子：[快速展示教学价值的开场]
        内容文案：[15-60秒的产品使用教程]
        拍摄建议：[教学演示的拍摄指导]
        爆款属性：ARPU 1.5万-2万，CTR 6%-7%，适配10-60s短视频
      `,
      testimonial: `
        请为${productInfo.industry}行业的产品生成一个"用户见证型"短视频脚本。
        产品信息：
        - 品牌：${productInfo.brandName}
        - 核心卖点：${productInfo.sellingPoints.join('、')}
        - 活动优惠：${productInfo.promotionInfo}
        - 目标人群：${productInfo.targetAudience}
        - 视频目的：${productInfo.videoPurpose}
        - 违禁词：${productInfo.forbiddenWords}

        请按以下格式输出：
        标题：[用户推荐类标题]
        封面建议：[用户使用场景的封面设计]
        黄金3s钩子：[真实用户反馈的开场]
        内容文案：[15-60秒的用户见证文案]
        拍摄建议：[用户使用场景的拍摄指导]
        爆款属性：ARPU 1.5万-2万，CTR 6%-7%，适配10-60s短视频
      `
    };

    return templates[templateType];
  }

  // 调用DeepSeek API生成脚本
  async generateScript(productInfo: ProductInfo, templateType: ScriptTemplateType): Promise<ScriptContent> {
    try {
      const prompt = this.getScriptPrompt(productInfo, templateType);
      
      const response = await axios.post(this.apiUrl, {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的短视频脚本创作专家，擅长为电商产品创作吸引人的短视频脚本。请严格按照要求的格式输出内容。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false,
        temperature: 0.8
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 120000 // 设置2分钟超时
      });

      const content = response.data.choices[0].message.content;
      return this.parseScriptContent(content, templateType);
    } catch (error) {
      console.error('AI服务调用失败:', error);
      throw new Error('脚本生成失败，请稍后重试');
    }
  }

  // 解析AI返回的脚本内容
  private parseScriptContent(content: string, templateType: ScriptTemplateType): ScriptContent {
    console.log('AI返回的原始内容:', content);
    
    const lines = content.split('\n').filter(line => line.trim());
    
    const result = {
      sessionId: '', // 将在调用处设置
      templateType,
      title: '',
      coverSuggestion: '',
      hook: '',
      content: '',
      shootingGuide: '',
      performanceMetrics: ''
    };

    let currentSection = '';
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      console.log(`解析第${i + 1}行:`, line);
      
      if (line.startsWith('标题：') || line.startsWith('标题:')) {
        // 保存之前的内容
        this.saveCurrentSection(currentSection, currentContent, result);
        
        currentSection = 'title';
        currentContent = [line.replace(/标题[：:]\s*/, '').trim()];
        console.log('提取到标题:', currentContent[0]);
      } else if (line.startsWith('封面建议：') || line.startsWith('封面建议:')) {
        // 保存之前的内容
        this.saveCurrentSection(currentSection, currentContent, result);
        
        currentSection = 'coverSuggestion';
        currentContent = [line.replace(/封面建议[：:]\s*/, '').trim()];
        console.log('提取到封面建议:', currentContent[0]);
      } else if (line.startsWith('黄金3s钩子：') || line.startsWith('黄金3s钩子:')) {
        // 保存之前的内容
        this.saveCurrentSection(currentSection, currentContent, result);
        
        currentSection = 'hook';
        currentContent = [line.replace(/黄金3s钩子[：:]\s*/, '').trim()];
        console.log('提取到钩子:', currentContent[0]);
      } else if (line.startsWith('内容文案：') || line.startsWith('内容文案:')) {
        // 保存之前的内容
        this.saveCurrentSection(currentSection, currentContent, result);
        
        currentSection = 'content';
        currentContent = [line.replace(/内容文案[：:]\s*/, '').trim()];
        console.log('提取到内容文案:', currentContent[0]);
      } else if (line.startsWith('拍摄建议：') || line.startsWith('拍摄建议:')) {
        // 保存之前的内容
        this.saveCurrentSection(currentSection, currentContent, result);
        
        currentSection = 'shootingGuide';
        currentContent = [line.replace(/拍摄建议[：:]\s*/, '').trim()];
        console.log('提取到拍摄建议:', currentContent[0]);
      } else if (line.startsWith('爆款属性：') || line.startsWith('爆款属性:')) {
        // 保存之前的内容
        this.saveCurrentSection(currentSection, currentContent, result);
        
        currentSection = 'performanceMetrics';
        currentContent = [line.replace(/爆款属性[：:]\s*/, '').trim()];
        console.log('提取到爆款属性:', currentContent[0]);
      } else if (currentSection && line) {
        // 如果当前有活跃的section，且这一行不是新的section标题，则添加到当前内容
        currentContent.push(line);
      }
    }

    // 保存最后一个section的内容
    this.saveCurrentSection(currentSection, currentContent, result);

    // 如果没有找到标题，尝试从第一行提取
    if (!result.title && lines.length > 0) {
      const firstLine = lines[0].trim();
      if (!firstLine.includes('：') && !firstLine.includes(':')) {
        result.title = firstLine;
        console.log('从第一行提取标题:', result.title);
      }
    }

    // 如果没有找到封面建议，尝试从第二行提取
    if (!result.coverSuggestion && lines.length > 1) {
      const secondLine = lines[1].trim();
      if (!secondLine.includes('：') && !secondLine.includes(':')) {
        result.coverSuggestion = secondLine;
        console.log('从第二行提取封面建议:', result.coverSuggestion);
      }
    }

    console.log('解析结果:', result);
    return result;
  }

  // 保存当前section的内容到对应的变量
  private saveCurrentSection(section: string, content: string[], result: any) {
    if (!section || content.length === 0) return;
    
    const contentStr = content.filter(c => c.trim()).join('\n');
    
    switch (section) {
      case 'title':
        result.title = contentStr;
        break;
      case 'coverSuggestion':
        result.coverSuggestion = contentStr;
        break;
      case 'hook':
        result.hook = contentStr;
        break;
      case 'content':
        result.content = contentStr;
        break;
      case 'shootingGuide':
        result.shootingGuide = contentStr;
        break;
      case 'performanceMetrics':
        result.performanceMetrics = contentStr;
        break;
    }
  }

  // 批量生成6个不同模板的脚本
  async generateMultipleScripts(productInfo: ProductInfo, sessionId: string): Promise<ScriptContent[]> {
    const templateTypes: ScriptTemplateType[] = [
      'problem_solution',
      'product_showcase', 
      'story_telling',
      'comparison',
      'tutorial',
      'testimonial'
    ];

    // 并发生成所有脚本，提高效率
    const scriptPromises = templateTypes.map(async (templateType) => {
      try {
        const script = await this.generateScript(productInfo, templateType);
        script.sessionId = sessionId;
        return script;
      } catch (error) {
        console.error(`生成${templateType}模板脚本失败:`, error);
        return null; // 返回null表示失败
      }
    });

    // 等待所有脚本生成完成
    const results = await Promise.all(scriptPromises);
    
    // 过滤掉失败的脚本
    return results.filter(script => script !== null) as ScriptContent[];
  }
}
