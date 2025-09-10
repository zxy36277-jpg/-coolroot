import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Apple风格简洁页脚 */}
        <div className="text-center space-y-6">
          {/* 品牌标识 */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">短视频脚本助手</span>
          </div>
          
          {/* 简洁描述 */}
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            基于AI技术的智能短视频脚本生成工具，帮助电商运营人员快速创作爆款内容
          </p>
          
          {/* 社交链接 */}
          <div className="flex items-center justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          
          {/* 版权信息 */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400 flex items-center justify-center">
              Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by AI
              <span className="mx-2">•</span>
              © 2024 脚本助手
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
