import React from 'react';
import { Button, ConfigProvider } from 'antd';

interface TravelButtonProps {
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  danger?: boolean; // Add danger variant for delete buttons
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TravelButton: React.FC<TravelButtonProps> = ({
  type = 'primary',
  danger = false,
  htmlType = 'button',
  loading = false,
  disabled = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const getDangerColors = () => {
    if (danger && type === 'primary') {
      return {
        bg: '#dc2626',
        bgHover: '#b91c1c',
        border: 'none',
        color: '#ffffff',
      };
    }
    return null;
  };

  const dangerColors = getDangerColors();
  
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: danger ? '#dc2626' : 'var(--travel-primary-600)',
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
            defaultBg: '#f9fafb',
            defaultBorderColor: '#e5e7eb',
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
              e.currentTarget.style.background = dangerColors ? dangerColors.bgHover : 'var(--travel-primary-700)';
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            if (type === 'primary') {
              e.currentTarget.style.transition = 'background 0.3s ease';
              e.currentTarget.style.background = dangerColors ? dangerColors.bg : 'var(--travel-primary-500)';
            }
          }
        }}
        style={{
          background: type === 'primary' ? (dangerColors ? dangerColors.bg : 'var(--travel-primary-500)') : '#f9fafb',
          border: type === 'primary' ? (dangerColors ? dangerColors.border : 'none') : '1px solid #e5e7eb',
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
