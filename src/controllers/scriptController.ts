import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AIService } from '../services/aiService';
import { FileService } from '../services/fileService';
import { dbRun, dbGet, dbAll } from '../database/database';
import { ProductInfo, ScriptContent, ApiResponse, GenerateScriptsRequest, GenerateScriptsResponse } from '../types';

export class ScriptController {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  // 创建新会话
  async createSession(req: Request, res: Response) {
    try {
      const sessionId = uuidv4();
      await dbRun('INSERT INTO sessions (id) VALUES (?)', [sessionId]);
      
      const response: ApiResponse<{ sessionId: string }> = {
        success: true,
        data: { sessionId }
      };
      
      res.json(response);
    } catch (error) {
      console.error('创建会话失败:', error);
      const response: ApiResponse = {
        success: false,
        error: '创建会话失败'
      };
      res.status(500).json(response);
    }
  }

  // 生成脚本
  async generateScripts(req: Request, res: Response) {
    // 设置请求超时时间为3分钟
    req.setTimeout(180000);
    
    try {
      const { productInfo, sessionId }: GenerateScriptsRequest = req.body;
      
      // 验证必填字段
      if (!productInfo.brandName || !productInfo.industry || !productInfo.videoPurpose) {
        const response: ApiResponse = {
          success: false,
          error: '品牌名称、行业和视频目的是必填项'
        };
        return res.status(400).json(response);
      }

      // 验证卖点数量
      if (!productInfo.sellingPoints || productInfo.sellingPoints.length < 1 || productInfo.sellingPoints.length > 3) {
        const response: ApiResponse = {
          success: false,
          error: '核心卖点必须包含1-3个'
        };
        return res.status(400).json(response);
      }

      // 创建新会话或使用现有会话
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = uuidv4();
        await dbRun('INSERT INTO sessions (id) VALUES (?)', [currentSessionId]);
      }

      // 保存产品信息
      await dbRun(`
        INSERT INTO product_info (
          session_id, brand_name, selling_points, promotion_info, 
          industry, target_audience, video_purpose, platforms, forbidden_words
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        currentSessionId,
        productInfo.brandName,
        JSON.stringify(productInfo.sellingPoints),
        productInfo.promotionInfo || '',
        productInfo.industry,
        productInfo.targetAudience || '',
        productInfo.videoPurpose,
        JSON.stringify(productInfo.platforms || []),
        productInfo.forbiddenWords || ''
      ]);

      // 生成脚本
      const scripts = await this.aiService.generateMultipleScripts(productInfo, currentSessionId);

      // 保存脚本到数据库
      for (const script of scripts) {
        await dbRun(`
          INSERT INTO scripts (
            session_id, template_type, title, cover_suggestion, 
            hook, content, shooting_guide, performance_metrics
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          script.sessionId,
          script.templateType,
          script.title,
          script.coverSuggestion,
          script.hook,
          script.content,
          script.shootingGuide,
          script.performanceMetrics
        ]);
      }

      const response: ApiResponse<GenerateScriptsResponse> = {
        success: true,
        data: {
          sessionId: currentSessionId,
          scripts
        }
      };

      res.json(response);
    } catch (error) {
      console.error('生成脚本失败:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : '生成脚本失败'
      };
      res.status(500).json(response);
    }
  }

  // 获取会话的脚本列表
  async getScripts(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      
      const scripts = await dbAll(`
        SELECT * FROM scripts 
        WHERE session_id = ? 
        ORDER BY created_at DESC
      `, [sessionId]);

      const response: ApiResponse<ScriptContent[]> = {
        success: true,
        data: scripts as ScriptContent[]
      };

      res.json(response);
    } catch (error) {
      console.error('获取脚本列表失败:', error);
      const response: ApiResponse = {
        success: false,
        error: '获取脚本列表失败'
      };
      res.status(500).json(response);
    }
  }

  // 更新脚本内容
  async updateScript(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // 构建更新字段
      const updateFields = [];
      const updateValues = [];

      if (updates.title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(updates.title);
      }
      if (updates.coverSuggestion !== undefined) {
        updateFields.push('cover_suggestion = ?');
        updateValues.push(updates.coverSuggestion);
      }
      if (updates.hook !== undefined) {
        updateFields.push('hook = ?');
        updateValues.push(updates.hook);
      }
      if (updates.content !== undefined) {
        updateFields.push('content = ?');
        updateValues.push(updates.content);
      }
      if (updates.shootingGuide !== undefined) {
        updateFields.push('shooting_guide = ?');
        updateValues.push(updates.shootingGuide);
      }
      if (updates.performanceMetrics !== undefined) {
        updateFields.push('performance_metrics = ?');
        updateValues.push(updates.performanceMetrics);
      }

      if (updateFields.length === 0) {
        const response: ApiResponse = {
          success: false,
          error: '没有需要更新的字段'
        };
        return res.status(400).json(response);
      }

      updateValues.push(id);

      await dbRun(`
        UPDATE scripts 
        SET ${updateFields.join(', ')} 
        WHERE id = ?
      `, updateValues);

      const response: ApiResponse = {
        success: true,
        message: '脚本更新成功'
      };

      res.json(response);
    } catch (error) {
      console.error('更新脚本失败:', error);
      const response: ApiResponse = {
        success: false,
        error: '更新脚本失败'
      };
      res.status(500).json(response);
    }
  }

  // 基于模板生成新脚本
  async generateScriptByTemplate(req: Request, res: Response) {
    try {
      const { sessionId, templateType } = req.params;
      
      // 获取产品信息
      const productInfoRow = await dbGet(`
        SELECT * FROM product_info 
        WHERE session_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `, [sessionId]) as any;

      if (!productInfoRow) {
        const response: ApiResponse = {
          success: false,
          error: '未找到产品信息'
        };
        return res.status(404).json(response);
      }

      // 重构产品信息对象
      const productInfo: ProductInfo = {
        brandName: productInfoRow.brand_name,
        sellingPoints: JSON.parse(productInfoRow.selling_points),
        promotionInfo: productInfoRow.promotion_info,
        industry: productInfoRow.industry,
        targetAudience: productInfoRow.target_audience,
        videoPurpose: productInfoRow.video_purpose,
        platforms: JSON.parse(productInfoRow.platforms),
        forbiddenWords: productInfoRow.forbidden_words
      };

      // 生成新脚本
      const script = await this.aiService.generateScript(productInfo, templateType as any);
      script.sessionId = sessionId;

      // 保存到数据库
      await dbRun(`
        INSERT INTO scripts (
          session_id, template_type, title, cover_suggestion, 
          hook, content, shooting_guide, performance_metrics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        script.sessionId,
        script.templateType,
        script.title,
        script.coverSuggestion,
        script.hook,
        script.content,
        script.shootingGuide,
        script.performanceMetrics
      ]);

      const response: ApiResponse<ScriptContent> = {
        success: true,
        data: script
      };

      res.json(response);
    } catch (error) {
      console.error('生成模板脚本失败:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : '生成脚本失败'
      };
      res.status(500).json(response);
    }
  }

  // 导出脚本
  async exportScripts(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      
      const scripts = await dbAll(`
        SELECT * FROM scripts 
        WHERE session_id = ? 
        ORDER BY created_at DESC
      `, [sessionId]) as any[];

      if (scripts.length === 0) {
        const response: ApiResponse = {
          success: false,
          error: '没有找到脚本内容'
        };
        return res.status(404).json(response);
      }

      // 生成导出文本
      let exportText = `短视频脚本导出\n生成时间: ${new Date().toLocaleString()}\n\n`;
      
      scripts.forEach((script: any, index: number) => {
        exportText += `脚本 ${index + 1}:\n`;
        exportText += `标题: ${script.title}\n`;
        exportText += `封面建议: ${script.cover_suggestion}\n`;
        exportText += `黄金3s钩子: ${script.hook}\n`;
        exportText += `内容文案:\n${script.content}\n`;
        exportText += `拍摄建议: ${script.shooting_guide}\n`;
        exportText += `爆款属性: ${script.performance_metrics}\n`;
        exportText += `\n${'='.repeat(50)}\n\n`;
      });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="scripts_${sessionId}.txt"`);
      res.send(exportText);
    } catch (error) {
      console.error('导出脚本失败:', error);
      const response: ApiResponse = {
        success: false,
        error: '导出脚本失败'
      };
      res.status(500).json(response);
    }
  }

  // 文件上传处理
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        const response: ApiResponse = {
          success: false,
          error: '请选择要上传的文件'
        };
        return res.status(400).json(response);
      }

      const filePath = req.file.path;
      const fileContent = await FileService.parseFile(filePath);
      const extractedInfo = FileService.extractProductInfo(fileContent);

      const response: ApiResponse<{
        content: string;
        extractedInfo: any;
      }> = {
        success: true,
        data: {
          content: fileContent,
          extractedInfo
        }
      };

      res.json(response);
    } catch (error) {
      console.error('文件上传处理失败:', error);
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : '文件处理失败'
      };
      res.status(500).json(response);
    }
  }
}
