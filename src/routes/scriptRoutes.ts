import { Router } from 'express';
import { ScriptController } from '../controllers/scriptController';
import { FileService } from '../services/fileService';

const router = Router();
const scriptController = new ScriptController();

// 文件上传中间件
const upload = FileService.getUploadMiddleware();

// 创建新会话
router.post('/sessions', (req, res) => scriptController.createSession(req, res));

// 生成脚本
router.post('/generate', (req, res) => scriptController.generateScripts(req, res));

// 获取会话的脚本列表
router.get('/sessions/:sessionId/scripts', (req, res) => scriptController.getScripts(req, res));

// 更新脚本内容
router.put('/scripts/:id', (req, res) => scriptController.updateScript(req, res));

// 基于模板生成新脚本
router.post('/sessions/:sessionId/templates/:templateType', (req, res) => 
  scriptController.generateScriptByTemplate(req, res)
);

// 导出脚本
router.get('/sessions/:sessionId/export', (req, res) => scriptController.exportScripts(req, res));

// 文件上传
router.post('/upload', upload.single('file'), (req, res) => scriptController.uploadFile(req, res));

export default router;
