import React, { useState } from 'react';
import { MoreHorizontal, Edit3, Copy, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Textarea } from './ui/Textarea';
import { ScriptContent } from '../types';
import { apiService } from '../services/api';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

interface ScriptCardProps {
  script: ScriptContent;
  onUpdate: (id: number, updates: Partial<ScriptContent>) => void;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editedContent, setEditedContent] = useState({
    title: script.title,
    coverSuggestion: script.coverSuggestion,
    hook: script.hook,
    content: script.content,
    shootingGuide: script.shootingGuide,
    performanceMetrics: script.performanceMetrics,
    hashtags: script.hashtags,
    callToAction: script.callToAction
  });

  const { setScriptError } = useStore();

  const handleSave = async () => {
    try {
      await apiService.updateScript(script.id!, editedContent);
      onUpdate(script.id!, editedContent);
      setIsEditing(false);
    } catch (error) {
      setScriptError(error instanceof Error ? error.message : '保存失败');
    }
  };

  const handleCancel = () => {
    setEditedContent({
      title: script.title,
      coverSuggestion: script.coverSuggestion,
      hook: script.hook,
      content: script.content,
      shootingGuide: script.shootingGuide,
      performanceMetrics: script.performanceMetrics,
      hashtags: script.hashtags,
      callToAction: script.callToAction
    });
    setIsEditing(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 可以添加一个toast提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleGenerateNew = async () => {
    if (!script.sessionId) return;
    
    setIsGenerating(true);
    try {
      const newScript = await apiService.generateScriptByTemplate(script.sessionId, script.templateType);
      onUpdate(script.id!, newScript);
    } catch (error) {
      setScriptError(error instanceof Error ? error.message : '生成新脚本失败');
    } finally {
      setIsGenerating(false);
      setShowMenu(false);
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      problem_solution: '问题解决型',
      product_showcase: '产品展示型',
      story_telling: '故事叙述型',
      comparison: '对比测评型',
      tutorial: '教程教学型',
      testimonial: '用户见证型'
    };
    return labels[type] || type;
  };

  return (
    <Card className="relative group hover:shadow-xl transition-all duration-300 ease-out" hover>
      {/* Apple风格头部 */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-200">
              {getTemplateTypeLabel(script.templateType)}
            </span>
          </div>
          {isEditing ? (
            <Textarea
              value={editedContent.title}
              onChange={(e) => setEditedContent(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-bold text-gray-900 border-0 bg-transparent p-0 resize-none focus:ring-0"
              rows={2}
            />
          ) : (
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{script.title}</h3>
          )}
        </div>
        
        {/* Apple风格操作菜单 */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-xl transition-all duration-200 group-hover:bg-gray-100/30"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-12 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-10 animate-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50/80 flex items-center transition-colors duration-200"
              >
                <Edit3 className="w-4 h-4 mr-3" />
                编辑内容
              </button>
              <button
                onClick={() => {
                  handleCopy(script.content);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50/80 flex items-center transition-colors duration-200"
              >
                <Copy className="w-4 h-4 mr-3" />
                复制文案
              </button>
              <button
                onClick={handleGenerateNew}
                disabled={isGenerating}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50/80 flex items-center disabled:opacity-50 transition-colors duration-200"
              >
                <RefreshCw className={clsx("w-4 h-4 mr-3", isGenerating && "animate-spin")} />
                生成新内容
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apple风格内容区域 */}
      <div className="space-y-6">
        {/* 封面建议 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">封面建议</h4>
          {isEditing ? (
            <Textarea
              value={editedContent.coverSuggestion}
              onChange={(e) => setEditedContent(prev => ({ ...prev, coverSuggestion: e.target.value }))}
              rows={2}
              className="border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <p className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl leading-relaxed">{script.coverSuggestion}</p>
          )}
        </div>

        {/* 黄金3s钩子 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">黄金3s钩子</h4>
          {isEditing ? (
            <Textarea
              value={editedContent.hook}
              onChange={(e) => setEditedContent(prev => ({ ...prev, hook: e.target.value }))}
              rows={2}
              className="border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <p className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl leading-relaxed">{script.hook}</p>
          )}
        </div>

        {/* 内容文案 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">内容文案</h4>
          {isEditing ? (
            <Textarea
              value={editedContent.content}
              onChange={(e) => setEditedContent(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <div className="bg-gray-50/50 p-5 rounded-xl">
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{script.content}</p>
              <button
                onClick={() => handleCopy(script.content)}
                className="mt-3 text-xs text-primary-600 hover:text-primary-700 flex items-center transition-colors duration-200"
              >
                <Copy className="w-3 h-3 mr-1" />
                复制文案
              </button>
            </div>
          )}
        </div>

        {/* 拍摄建议 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">拍摄建议</h4>
          {isEditing ? (
            <Textarea
              value={editedContent.shootingGuide}
              onChange={(e) => setEditedContent(prev => ({ ...prev, shootingGuide: e.target.value }))}
              rows={3}
              className="border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <p className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl leading-relaxed">{script.shootingGuide}</p>
          )}
        </div>

        {/* 爆款属性 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">爆款属性</h4>
          {isEditing ? (
            <Textarea
              value={editedContent.performanceMetrics}
              onChange={(e) => setEditedContent(prev => ({ ...prev, performanceMetrics: e.target.value }))}
              rows={2}
              className="border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-xl border border-primary-200">
              <p className="text-sm text-primary-700 font-medium leading-relaxed">{script.performanceMetrics}</p>
            </div>
          )}
        </div>

        {/* 话题标签 */}
        {script.hashtags && script.hashtags.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">话题标签</h4>
            {isEditing ? (
              <Textarea
                value={editedContent.hashtags?.join(' ') || ''}
                onChange={(e) => setEditedContent(prev => ({ ...prev, hashtags: e.target.value.split(' ').filter(tag => tag.trim()) }))}
                rows={2}
                className="border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500"
                placeholder="输入话题标签，用空格分隔"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {script.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 行动号召 */}
        {script.callToAction && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">行动号召</h4>
            {isEditing ? (
              <Textarea
                value={editedContent.callToAction || ''}
                onChange={(e) => setEditedContent(prev => ({ ...prev, callToAction: e.target.value }))}
                rows={2}
                className="border-0 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 font-medium leading-relaxed">{script.callToAction}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apple风格编辑模式操作按钮 */}
      {isEditing && (
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
          <Button variant="ghost" onClick={handleCancel} className="px-6">
            取消
          </Button>
          <Button onClick={handleSave} className="px-6">
            保存更改
          </Button>
        </div>
      )}
    </Card>
  );
};
