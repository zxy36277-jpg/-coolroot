import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  checked,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <div className="relative">
          <input
            id={checkboxId}
            type="checkbox"
            className="sr-only"
            checked={checked}
            {...props}
          />
          <div
            className={clsx(
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
              checked
                ? 'bg-primary-600 border-primary-600'
                : 'bg-white border-gray-300 hover:border-gray-400',
              error && 'border-red-300',
              className
            )}
          >
            {checked && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
        </div>
        {label && (
          <label htmlFor={checkboxId} className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 ml-8">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 ml-8">{helperText}</p>
      )}
    </div>
  );
};
