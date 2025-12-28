import React from 'react';
import { Input, ConfigProvider } from 'antd';

interface TravelInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  className?: string;
  disabled?: boolean;
  error?: string;
}

const TravelInput: React.FC<TravelInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyPress,
  required = false,
  maxLength,
  minLength,
  className = '',
  disabled = false,
  error,
  ...props
}) => {
  const InputComponent = type === 'password' ? Input.Password : Input;

  return (
    <div className="w-full">
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: 'var(--travel-primary-600)',
            borderRadius: 12,
            colorBgContainer: '#f9fafb',
            colorText: '#111827',
            colorTextPlaceholder: '#9ca3af',
            colorBorder: '#e5e7eb',
            controlHeight: 40,
            fontSize: 14,
          },
          components: {
            Input: {
              colorBgContainer: '#f9fafb',
              colorBorder: '#e5e7eb',
              colorText: '#111827',
              colorTextPlaceholder: '#9ca3af',
              borderRadius: 12,
              controlHeight: 40,
              fontSize: 14,
              paddingInline: 12,
              paddingBlock: 8,
              boxShadow: 'none',
              hoverBorderColor: '#d1d5db',
              activeBorderColor: 'var(--travel-primary-600)',
              colorPrimaryBorder: 'var(--travel-primary-600)',
              activeShadow: 'none',
              colorTextDescription: 'transparent',
            },
          },
        }}
      >
        <InputComponent
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          className={`w-full ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </ConfigProvider>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default TravelInput;
