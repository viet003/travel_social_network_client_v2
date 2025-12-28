import React from 'react';
import { Select, ConfigProvider } from 'antd';

interface TravelSelectProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
}

const TravelSelect: React.FC<TravelSelectProps> = ({
  placeholder,
  value,
  onChange,
  options = [],
  className = '',
  disabled = false,
  getPopupContainer,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
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
          Select: {
            selectorBg: '#f9fafb',
            borderRadius: 12,
            colorBorder: '#e5e7eb',
            hoverBorderColor: '#d1d5db',
            activeBorderColor: 'var(--travel-primary-600)',
            optionSelectedColor: '#1f2937',
            optionSelectedBg: '#e6f4ff',
            optionActiveBg: '#f9fafb',
          },
        },
      }}
    >
      <Select
        placeholder={placeholder}
        value={value || undefined}
        onChange={onChange}
        options={options}
        disabled={disabled}
        getPopupContainer={getPopupContainer}
        className={`w-full focus:outline-none focus:ring-0 ${className}`}
        style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          height: '40px',
          fontSize: '14px',
          fontWeight: 400,
          color: '#111827',
        }}
        {...props}
      />
    </ConfigProvider>
  );
};

export default TravelSelect;
