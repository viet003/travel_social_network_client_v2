import React from 'react';
import { TimePicker, ConfigProvider } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface TravelTimePickerProps {
  placeholder?: string;
  value?: string;
  onChange?: (time: string) => void;
  format?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
}

const TravelTimePicker: React.FC<TravelTimePickerProps> = ({
  placeholder = 'Chọn giờ',
  value,
  onChange,
  format = 'HH:mm',
  className = '',
  disabled = false,
  error,
  getPopupContainer,
  ...props
}) => {
  const handleChange = (time: Dayjs | null) => {
    if (onChange) {
      onChange(time ? time.format('HH:mm') : '');
    }
  };

  return (
    <div className="w-full">
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '#3b82f6',
            borderRadius: 12,
            colorBgContainer: '#f9fafb',
            colorText: '#111827',
            colorTextPlaceholder: '#9ca3af',
            colorBorder: '#e5e7eb',
            controlHeight: 40,
            fontSize: 14,
            colorPrimaryBg: '#dbeafe',
            colorPrimaryBgHover: '#bfdbfe',
            colorPrimaryBorder: '#3b82f6',
            colorPrimaryHover: '#2563eb',
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
              activeBorderColor: '#3b82f6',
              activeShadow: 'none',
              cellHoverBg: '#dbeafe',
              cellActiveWithRangeBg: '#bfdbfe',
              cellBgDisabled: '#f3f4f6',
              colorTextDisabled: '#9ca3af',
            },
          },
        }}
      >
        <TimePicker
          placeholder={placeholder}
          value={value ? dayjs(value, 'HH:mm') : null}
          onChange={handleChange}
          format={format}
          disabled={disabled}
          getPopupContainer={getPopupContainer}
          className={`w-full ${error ? 'border-red-500' : ''} ${className} cursor-pointer`}
          style={{
            backgroundColor: '#f9fafb',
            border: error ? '1px solid #ef4444' : '1px solid #e5e7eb',
            borderRadius: '12px',
            height: '40px',
            fontSize: '14px',
            color: '#111827',
            boxShadow: 'none',
          }}
          {...props}
        />
      </ConfigProvider>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default TravelTimePicker;
