import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isLoading?: boolean;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isLoading = false,
  error
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

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
          error && 'border-red-300 bg-red-50',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="space-y-2">
            <FileText className="w-8 h-8 text-primary-600 mx-auto" />
            <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
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
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className={clsx(
              'w-8 h-8 mx-auto',
              isDragActive ? 'text-primary-600' : 'text-gray-400'
            )} />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragActive ? '释放文件以上传' : '拖拽文件到这里或点击选择'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                支持 TXT、PDF、DOCX、DOC 格式，最大 10MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
