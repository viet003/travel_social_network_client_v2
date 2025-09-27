import React from 'react';
import { Select, ConfigProvider } from 'antd';

interface TravelSelectProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
}

const TravelSelect: React.FC<TravelSelectProps> = ({
  placeholder,
  value,
  onChange,
  options = [],
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'var(--travel-primary-600)',
          borderRadius: 12,
          colorBgContainer: '#f3f4f6',
          colorText: '#111827',
          colorTextPlaceholder: '#374151',
          colorBorder: 'transparent',
          controlHeight: 40,
          fontSize: 14,
        },
        components: {
          Select: {
            selectorBg: '#f3f4f6',
            borderRadius: 12,
            // borderColor: 'transparent', // mặc định
            hoverBorderColor: 'var(--travel-primary-600)', // hover
            activeBorderColor: 'var(--travel-primary-600)', // focus
            optionSelectedColor: '#1f2937',
            optionSelectedBg: '#e6f4ff',
            optionActiveBg: '#f3f4f6',
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
        className={`w-full focus:outline-none focus:ring-0 ${className}`}
        style={{
          backgroundColor: '#f3f4f6',
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
