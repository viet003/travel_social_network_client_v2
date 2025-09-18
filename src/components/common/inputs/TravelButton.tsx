import React from 'react';
import { Button, ConfigProvider } from 'antd';

interface TravelButtonProps {
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TravelButton: React.FC<TravelButtonProps> = ({
  type = 'primary',
  htmlType = 'button',
  loading = false,
  disabled = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: 'var(--travel-primary-600)',
          borderRadius: 12,
          controlHeight: 40,
          fontSize: 14,
        },
        components: {
          Button: {
            borderRadius: 12,
            controlHeight: 40,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: 'none',
            primaryShadow: 'none',
            defaultShadow: 'none',
            primaryColor: '#ffffff',
            defaultColor: '#374151',
            defaultBg: '#f3f4f6',
            defaultBorderColor: 'transparent',
          },
        },
      }}
    >
      <Button
        type={type}
        htmlType={htmlType}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        className={`w-full sm:w-auto transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            if (type === 'primary') {
              e.currentTarget.style.transition = 'background 0.3s ease';
              e.currentTarget.style.background = 'var(--travel-gradient-dark)';
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            if (type === 'primary') {
              e.currentTarget.style.transition = 'background 0.3s ease';
              e.currentTarget.style.background = 'var(--travel-gradient)';
            }
          }
        }}
        style={{
          background: type === 'primary' ? 'var(--travel-gradient)' : '#f3f4f6',
          border: 'none',
          borderRadius: '12px',
          height: '40px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: 'none',
          color: type === 'primary' ? '#ffffff' : '#374151',
        }}
        {...props}
      >
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default TravelButton;
