import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';
import { Card } from './ui/Card';
import { FileUpload } from './FileUpload';
import { useStore } from '../store/useStore';
import { IndustryType, VideoPurposeType, PlatformType } from '../types';
import { apiService } from '../services/api';

const INDUSTRY_OPTIONS: { value: IndustryType; label: string }[] = [
  { value: '服装', label: '服装' },
  { value: '美妆护肤', label: '美妆护肤' },
  { value: '3c数码', label: '3C数码' },
  { value: '家居家纺', label: '家居家纺' },
  { value: '食品', label: '食品' },
  { value: '保健品', label: '保健品' },
  { value: '个护百货', label: '个护百货' },
  { value: '大小家电', label: '大小家电' },
  { value: '内衣内裤', label: '内衣内裤' },
  { value: '鞋服箱包', label: '鞋服箱包' }
];

const VIDEO_PURPOSE_OPTIONS: { value: VideoPurposeType; label: string }[] = [
  { value: '广告营销卖货', label: '广告营销卖货' },
  { value: '直播间引流', label: '直播间引流' },
  { value: '种草带货', label: '种草带货' },
  { value: '品宣曝光机制', label: '品宣曝光机制' }
];

const PLATFORM_OPTIONS: { value: PlatformType; label: string }[] = [
  { value: '抖音', label: '抖音' },
  { value: '快手', label: '快手' },
  { value: '小红书', label: '小红书' },
  { value: '视频号', label: '视频号' },
  { value: 'B站', label: 'B站' },
  { value: '淘宝', label: '淘宝' },
  { value: '京东', label: '京东' }
];

export const ProductInfoForm: React.FC = () => {
  const { formState, updateProductInfo, setFormLoading, setFormError, setScripts, setCurrentSessionId, showToast } = useStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);


  const handleFileSelect = async (file: File) => {
    setFileError(null);
    setSelectedFile(file);
    
    try {
      console.log('开始上传文件:', file.name);
      const result = await apiService.uploadFile(file);
      console.log('文件上传结果:', result);
      
      if (result.extractedInfo) {
        console.log('提取的信息:', result.extractedInfo);
        
        // 处理平台信息，确保类型正确
        const processedInfo = { ...result.extractedInfo };
        
        // 验证和转换平台信息
        if (processedInfo.platforms && Array.isArray(processedInfo.platforms)) {
          const validPlatforms = processedInfo.platforms.filter((platform: string) => 
            ['抖音', '快手', '小红书', '视频号', 'B站', '淘宝', '京东'].includes(platform)
          ) as PlatformType[];
          processedInfo.platforms = validPlatforms;
        } else if (processedInfo.platforms && typeof processedInfo.platforms === 'string') {
          // 如果平台信息是字符串，尝试解析
          const platformText = processedInfo.platforms;
          const platforms = platformText.split(/[，,、\s]/).map((p: string) => p.trim()).filter((p: string) => p);
          const validPlatforms = platforms.filter((platform: string) => 
            ['抖音', '快手', '小红书', '视频号', 'B站', '淘宝', '京东'].includes(platform)
          ) as PlatformType[];
          processedInfo.platforms = validPlatforms;
        }
        
        // 验证行业信息
        if (processedInfo.industry) {
          const validIndustries = ['服装', '美妆护肤', '3c数码', '家居家纺', '食品', '保健品', '个护百货', '大小家电', '内衣内裤', '鞋服箱包'];
          if (!validIndustries.includes(processedInfo.industry)) {
            // 如果行业不在预定义列表中，尝试模糊匹配
            const matchedIndustry = validIndustries.find(industry => 
              industry.includes(processedInfo.industry) || processedInfo.industry.includes(industry)
            );
            if (matchedIndustry) {
              processedInfo.industry = matchedIndustry;
            } else {
              // 如果没有匹配，清空行业字段
              processedInfo.industry = '';
            }
          }
        }
        
        // 验证视频目的
        if (processedInfo.videoPurpose) {
          const validPurposes = ['广告营销卖货', '直播间引流', '种草带货', '品宣曝光机制'];
          if (!validPurposes.includes(processedInfo.videoPurpose)) {
            // 如果目的不在预定义列表中，尝试模糊匹配
            const matchedPurpose = validPurposes.find(purpose => 
              purpose.includes(processedInfo.videoPurpose) || processedInfo.videoPurpose.includes(purpose)
            );
            if (matchedPurpose) {
              processedInfo.videoPurpose = matchedPurpose;
            } else {
              // 如果没有匹配，清空目的字段
              processedInfo.videoPurpose = '';
            }
          }
        }
        
        // 确保卖点信息是数组格式
        if (processedInfo.sellingPoints && !Array.isArray(processedInfo.sellingPoints)) {
          if (typeof processedInfo.sellingPoints === 'string') {
            processedInfo.sellingPoints = processedInfo.sellingPoints.split(/[，,、；;]/)
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 0);
          } else {
            processedInfo.sellingPoints = [];
          }
        }
        
        // 确保卖点数组长度在1-3之间
        if (processedInfo.sellingPoints && processedInfo.sellingPoints.length > 3) {
          processedInfo.sellingPoints = processedInfo.sellingPoints.slice(0, 3);
        }
        
        console.log('处理后的信息:', processedInfo);
        updateProductInfo(processedInfo);
        
        // 显示成功提示
        const extractedFields = Object.keys(processedInfo).filter(key => 
          processedInfo[key] && 
          (Array.isArray(processedInfo[key]) ? processedInfo[key].length > 0 : true)
        );
        
        if (extractedFields.length > 0) {
          console.log(`成功提取了 ${extractedFields.length} 个字段的信息`);
          showToast('success', `文件上传成功！已自动填充 ${extractedFields.length} 个字段的信息`);
        } else {
          showToast('warning', '文件上传成功，但未提取到有效信息，请检查文件格式');
        }
      } else {
        console.log('没有提取到有效信息');
        setFileError('文件格式不正确或未找到有效信息');
      }
    } catch (error) {
      console.error('文件上传错误:', error);
      const errorMessage = error instanceof Error ? error.message : '文件处理失败';
      setFileError(errorMessage);
      showToast('error', `文件上传失败：${errorMessage}`);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  const handleSellingPointChange = (index: number, value: string) => {
    const newSellingPoints = [...formState.productInfo.sellingPoints];
    newSellingPoints[index] = value;
    updateProductInfo({ sellingPoints: newSellingPoints });
  };

  const addSellingPoint = () => {
    if (formState.productInfo.sellingPoints.length < 3) {
      updateProductInfo({
        sellingPoints: [...formState.productInfo.sellingPoints, '']
      });
    }
  };

  const removeSellingPoint = (index: number) => {
    if (formState.productInfo.sellingPoints.length > 1) {
      const newSellingPoints = formState.productInfo.sellingPoints.filter((_, i) => i !== index);
      updateProductInfo({ sellingPoints: newSellingPoints });
    }
  };

  const handlePlatformChange = (platform: PlatformType, checked: boolean) => {
    const currentPlatforms = formState.productInfo.platforms;
    if (checked) {
      updateProductInfo({ platforms: [...currentPlatforms, platform] });
    } else {
      updateProductInfo({ platforms: currentPlatforms.filter(p => p !== platform) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!formState.productInfo.brandName.trim()) {
      setFormError('请输入产品品牌名称');
      return;
    }
    
    if (!formState.productInfo.industry) {
      setFormError('请选择产品行业');
      return;
    }
    
    if (!formState.productInfo.videoPurpose) {
      setFormError('请选择短视频目的');
      return;
    }
    
    const validSellingPoints = formState.productInfo.sellingPoints.filter(point => point.trim());
    if (validSellingPoints.length === 0) {
      setFormError('请至少输入一个核心卖点');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const result = await apiService.generateScripts({
        productInfo: {
          ...formState.productInfo,
          sellingPoints: validSellingPoints
        }
      });
      
      setScripts(result.scripts);
      setCurrentSessionId(result.sessionId);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : '生成脚本失败');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Apple风格页面标题 */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            短视频脚本生成助手
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            输入您的产品信息，AI将为您生成6条不同风格的爆款短视频脚本
          </p>
        </div>
        
        {/* 功能亮点 */}
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span>智能识别</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span>6种模板</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span>一键导出</span>
          </div>
        </div>
      </div>

      {/* 主要内容卡片 */}
      <Card className="p-8">
        <div className="space-y-8">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 文件上传 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              产品信息录入
            </h3>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFile={selectedFile}
              error={fileError || undefined}
            />
            <p className="text-sm text-gray-500 mt-2">
              您也可以直接填写下方表单，或上传包含产品信息的文件
            </p>
          </div>

          {/* 品牌名称 */}
          <Input
            label="产品品牌名称 *"
            value={formState.productInfo.brandName}
            onChange={(e) => updateProductInfo({ brandName: e.target.value })}
            placeholder="请输入产品品牌名称"
            required
          />

          {/* 核心卖点 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              核心卖点 * (1-3个)
            </label>
            <div className="space-y-3">
              {formState.productInfo.sellingPoints.map((point, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={point}
                    onChange={(e) => handleSellingPointChange(index, e.target.value)}
                    placeholder={`卖点 ${index + 1}`}
                    className="flex-1"
                  />
                  {formState.productInfo.sellingPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSellingPoint(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {formState.productInfo.sellingPoints.length < 3 && (
                <button
                  type="button"
                  onClick={addSellingPoint}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加卖点
                </button>
              )}
            </div>
          </div>

          {/* 活动优惠 */}
          <Textarea
            label="产品活动优惠"
            value={formState.productInfo.promotionInfo}
            onChange={(e) => updateProductInfo({ promotionInfo: e.target.value })}
            placeholder="请输入活动优惠信息，如：限时8折、买二送一等"
            rows={3}
          />

          {/* 产品行业 */}
          <Select
            label="产品行业 *"
            value={formState.productInfo.industry}
            onChange={(e) => updateProductInfo({ industry: e.target.value as IndustryType })}
            options={INDUSTRY_OPTIONS}
            placeholder="请选择产品行业"
            required
          />

          {/* 目标人群 */}
          <Input
            label="产品使用人群"
            value={formState.productInfo.targetAudience}
            onChange={(e) => updateProductInfo({ targetAudience: e.target.value })}
            placeholder="如：25-35岁女性、学生群体等"
          />

          {/* 短视频目的 */}
          <Select
            label="短视频目的 *"
            value={formState.productInfo.videoPurpose}
            onChange={(e) => updateProductInfo({ videoPurpose: e.target.value as VideoPurposeType })}
            options={VIDEO_PURPOSE_OPTIONS}
            placeholder="请选择短视频目的"
            required
          />

          {/* 适配平台 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              适配的媒体平台 (可多选)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PLATFORM_OPTIONS.map((platform) => (
                <Checkbox
                  key={platform.value}
                  label={platform.label}
                  checked={formState.productInfo.platforms.includes(platform.value)}
                  onChange={(e) => handlePlatformChange(platform.value, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* 违禁词 */}
          <Textarea
            label="违禁词"
            value={formState.productInfo.forbiddenWords}
            onChange={(e) => updateProductInfo({ forbiddenWords: e.target.value })}
            placeholder="请输入需要避免的违禁词，用逗号分隔"
            rows={2}
          />

          {/* 错误提示 */}
          {formState.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{formState.error}</p>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="pt-4">
            <Button
              type="submit"
              loading={formState.isLoading}
              className="w-full"
              size="lg"
            >
              {formState.isLoading ? '正在生成脚本...' : '生成脚本'}
            </Button>
          </div>
        </form>
        </div>
      </Card>
    </div>
  );
};
