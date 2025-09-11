import * as React from 'react';
import { Sparkles, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Header: React.FC = () => {
  const { clearScripts, resetForm } = useStore();

  const handleHomeClick = () => {
    // 清空脚本和表单，回到首页
    clearScripts();
    resetForm();
  };

  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Apple风格Logo */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                短视频脚本助手
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                AI智能生成爆款脚本
              </p>
            </div>
          </button>

          {/* 简洁导航菜单 */}
          <nav className="hidden md:flex items-center space-x-1">
            <button 
              onClick={handleHomeClick}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200"
            >
              首页
            </button>
            <a href="#" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200">
              模板库
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200">
              帮助
            </a>
          </nav>

          {/* 移动端菜单按钮 */}
          <button className="md:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
