import React from 'react';
import { Checkbox, ConfigProvider } from 'antd';

interface TravelCheckboxProps {
  checked?: boolean;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const TravelCheckbox: React.FC<TravelCheckboxProps> = ({
  checked = false,
  onChange,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: 'var(--travel-primary-600)',
          borderRadius: 4,
          fontSize: 12,
          colorText: '#6b7280',
        },
        components: {
          Checkbox: {
            borderRadius: 4,
            fontSize: 12,
            colorText: '#6b7280',
            colorPrimary: 'var(--travel-primary-600)',
            colorPrimaryBorder: 'var(--travel-primary-600)',
            colorPrimaryHover: 'var(--travel-primary-600)',
            controlInteractiveSize: 12,
          },
        },
      }}
    >
      <Checkbox
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`${className}`}
        style={{
          fontSize: '12px',
          color: '#6b7280',
        }}
        // styles={{
        //   wrapper: {
        //     fontSize: '12px',
        //     color: '#6b7280',
        //   },
        // }}
        {...props}
      >
        {children}
      </Checkbox>
    </ConfigProvider>
  );
};

export default TravelCheckbox;
