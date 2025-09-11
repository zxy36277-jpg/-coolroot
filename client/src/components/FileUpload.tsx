import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isLoading?: boolean;
  error?: string;
  uploadStatus?: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
  extractedInfo?: any;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isLoading = false,
  error,
  uploadStatus = 'idle',
  extractedInfo
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false,
    disabled: isLoading
  });

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-8 h-8 text-primary-600 mx-auto animate-spin" />;
      case 'analyzing':
        return <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />;
      default:
        return selectedFile ? (
          <FileText className="w-8 h-8 text-primary-600 mx-auto" />
        ) : (
          <Upload className={clsx(
            'w-8 h-8 mx-auto',
            isDragActive ? 'text-primary-600' : 'text-gray-400'
          )} />
        );
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return '正在上传文件...';
      case 'analyzing':
        return 'AI正在分析文件内容...';
      case 'success':
        return '文件分析完成！';
      case 'error':
        return '文件处理失败';
      default:
        return selectedFile ? selectedFile.name : (isDragActive ? '释放文件以上传' : '拖拽文件到这里或点击选择');
    }
  };

  const getStatusSubtext = () => {
    switch (uploadStatus) {
      case 'uploading':
        return '请稍候，正在上传您的文件';
      case 'analyzing':
        return '正在识别品牌信息、卖点等关键内容';
      case 'success':
        return extractedInfo ? `已识别品牌: ${extractedInfo.brandName || '未知'}` : '文件处理完成';
      case 'error':
        return '请检查文件格式或重试';
      default:
        return selectedFile ? 
          `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 
          '支持 TXT、PDF、DOCX、DOC 格式，最大 10MB';
    }
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200',
          uploadStatus === 'uploading' || uploadStatus === 'analyzing' 
            ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
            : isDragActive
            ? 'border-primary-400 bg-primary-50 cursor-pointer'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer',
          error && 'border-red-300 bg-red-50',
          uploadStatus === 'success' && 'border-green-300 bg-green-50',
          uploadStatus === 'error' && 'border-red-300 bg-red-50'
        )}
      >
        <input {...getInputProps()} disabled={uploadStatus === 'uploading' || uploadStatus === 'analyzing'} />
        
        <div className="space-y-3">
          {getStatusIcon()}
          <div>
            <p className={clsx(
              'text-sm font-medium',
              uploadStatus === 'success' ? 'text-green-700' :
              uploadStatus === 'error' ? 'text-red-700' :
              uploadStatus === 'analyzing' ? 'text-blue-700' :
              'text-gray-700'
            )}>
              {getStatusText()}
            </p>
            <p className={clsx(
              'text-xs mt-1',
              uploadStatus === 'success' ? 'text-green-600' :
              uploadStatus === 'error' ? 'text-red-600' :
              uploadStatus === 'analyzing' ? 'text-blue-600' :
              'text-gray-500'
            )}>
              {getStatusSubtext()}
            </p>
          </div>
          
          {/* 分析进度指示器 */}
          {(uploadStatus === 'uploading' || uploadStatus === 'analyzing') && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={clsx(
                'h-2 rounded-full transition-all duration-1000',
                uploadStatus === 'uploading' ? 'bg-primary-600 w-1/3' : 'bg-blue-600 w-2/3'
              )}></div>
            </div>
          )}
          
          {/* 成功状态显示提取的信息 */}
          {uploadStatus === 'success' && extractedInfo && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 mb-2">识别到的信息:</p>
              <div className="space-y-1 text-xs text-gray-700">
                {extractedInfo.brandName && (
                  <div>品牌: <span className="font-medium text-green-700">{extractedInfo.brandName}</span></div>
                )}
                {extractedInfo.industry && (
                  <div>行业: <span className="font-medium text-green-700">{extractedInfo.industry}</span></div>
                )}
                {extractedInfo.sellingPoints && extractedInfo.sellingPoints.length > 0 && (
                  <div>卖点: <span className="font-medium text-green-700">{extractedInfo.sellingPoints.join('、')}</span></div>
                )}
              </div>
            </div>
          )}
          
          {/* 文件操作按钮 */}
          {selectedFile && uploadStatus !== 'uploading' && uploadStatus !== 'analyzing' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              移除文件
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
