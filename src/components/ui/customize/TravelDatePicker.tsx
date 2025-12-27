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
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
}

const TravelDatePicker: React.FC<TravelDatePickerProps> = ({
  placeholder = 'Ngày sinh',
  value,
  onChange,
  format = 'DD/MM/YYYY',
  className = '',
  disabled = false,
  getPopupContainer,
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
          colorBgContainer: '#f9fafb',
          colorText: '#111827',
          colorTextPlaceholder: '#9ca3af',
          colorBorder: '#e5e7eb',
          controlHeight: 40,
          fontSize: 14,
        },
        components: {
          DatePicker: {
            colorBgContainer: '#f9fafb',
            colorBorder: '#e5e7eb',
            colorText: '#111827',
            colorTextPlaceholder: '#9ca3af',
            borderRadius: 12,
            controlHeight: 40,
            fontSize: 14,
            boxShadow: 'none',
            hoverBorderColor: '#d1d5db',
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
        getPopupContainer={getPopupContainer}
        className={`w-full ${className}`}
        style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
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
