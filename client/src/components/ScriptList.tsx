import React, { useState } from 'react';
import { Download, Plus, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ScriptCard } from './ScriptCard';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api';

export const ScriptList: React.FC = () => {
  const { 
    scriptState, 
    setScripts, 
    setScriptLoading, 
    setScriptError, 
    formState,
    resetForm,
    clearScripts 
  } = useStore();
  
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerateMore = async () => {
    if (!scriptState.currentSessionId || !formState.productInfo.brandName) return;
    
    setScriptLoading(true);
    setScriptError(null);
    
    try {
      const result = await apiService.generateScripts({
        productInfo: formState.productInfo,
        sessionId: scriptState.currentSessionId
      });
      
      setScripts([...scriptState.scripts, ...result.scripts]);
    } catch (error) {
      setScriptError(error instanceof Error ? error.message : '生成更多脚本失败');
    } finally {
      setScriptLoading(false);
    }
  };

  const handleExport = async () => {
    if (!scriptState.currentSessionId) return;
    
    setIsExporting(true);
    try {
      const blob = await apiService.exportScripts(scriptState.currentSessionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scripts_${scriptState.currentSessionId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setScriptError(error instanceof Error ? error.message : '导出失败');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackToForm = () => {
    resetForm();
    clearScripts();
  };

  const handleUpdateScript = (id: number, updates: any) => {
    setScripts(
      scriptState.scripts.map(script =>
        script.id === id ? { ...script, ...updates } : script
      )
    );
  };

  if (scriptState.scripts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Apple风格头部操作栏 */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" onClick={handleBackToForm} className="px-4 py-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回表单
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                生成的脚本内容
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                共 {scriptState.scripts.length} 个脚本 • 6种不同风格
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={handleExport}
              loading={isExporting}
              className="px-6"
            >
              <Download className="w-4 h-4 mr-2" />
              导出脚本
            </Button>
            <Button
              onClick={handleGenerateMore}
              loading={scriptState.isLoading}
              className="px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              生成更多
            </Button>
          </div>
        </div>
      </Card>

      {/* 错误提示 */}
      {scriptState.error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-sm text-red-600">{scriptState.error}</p>
        </Card>
      )}

      {/* 脚本列表 */}
      <div className="grid gap-6">
        {scriptState.scripts.map((script, index) => (
          <div
            key={script.id || index}
            className="animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ScriptCard
              script={script}
              onUpdate={handleUpdateScript}
            />
          </div>
        ))}
      </div>

      {/* Apple风格底部操作栏 */}
      <Card className="p-8 text-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              需要更多脚本内容？
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              点击下方按钮可以基于相同产品信息生成更多不同风格的脚本，每次生成6条全新的内容
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>智能生成</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>多种风格</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>持续优化</span>
            </div>
          </div>
          
          <Button
            onClick={handleGenerateMore}
            loading={scriptState.isLoading}
            size="lg"
            className="px-8 py-4 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            生成更多脚本
          </Button>
        </div>
      </Card>
    </div>
  );
};
