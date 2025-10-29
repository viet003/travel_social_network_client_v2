import React from 'react';
import { Input, ConfigProvider } from 'antd';

interface TravelInputProps {
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  className?: string;
  disabled?: boolean;
}

const TravelInput: React.FC<TravelInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  maxLength,
  minLength,
  className = '',
  disabled = false,
  ...props
}) => {
  const InputComponent = type === 'password' ? Input.Password : Input;

  return (
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
          },
        },
      }}
    >
      <InputComponent
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        className={`w-full ${className}`}
        {...props}
      />
    </ConfigProvider>
  );
};

export default TravelInput;
