import React from 'react';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';

interface TravelDatePickerProps {
  placeholder?: string;
  value?: string;
  onChange?: (date: string) => void;
  format?: string;
  className?: string;
  disabled?: boolean;
}

const TravelDatePicker: React.FC<TravelDatePickerProps> = ({
  placeholder = 'Ngày sinh',
  value,
  onChange,
  format = 'DD/MM/YYYY',
  className = '',
  disabled = false,
  ...props
}) => {
  const handleChange = (date: any) => {
    if (onChange) {
      onChange(date ? date.format('YYYY-MM-DD') : '');
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
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
          DatePicker: {
            colorBgContainer: '#f3f4f6',
            colorBorder: 'transparent',
            colorText: '#111827',
            colorTextPlaceholder: '#374151',
            borderRadius: 12,
            controlHeight: 40,
            fontSize: 14,
            boxShadow: 'none',
            hoverBorderColor: 'var(--travel-primary-600)',
            activeBorderColor: 'var(--travel-primary-600)',
            activeShadow: 'none',
          },
        },
      }}
    >
      <DatePicker
        placeholder={placeholder}
        value={value ? dayjs(value) : null}
        onChange={handleChange}
        format={format}
        disabled={disabled}
        className={`w-full ${className}`}
        style={{
          backgroundColor: '#f3f4f6',
          border: 'none',
          borderRadius: '12px',
          height: '40px',
          fontSize: '14px',
          color: '#111827',
          boxShadow: 'none',
        }}
        {...props}
      />
    </ConfigProvider>
  );
};

export default TravelDatePicker;
