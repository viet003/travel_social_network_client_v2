import React from 'react';
import { Image, ConfigProvider } from 'antd';
import type { ImageProps } from 'antd';
import '../../../styles/travel-image.css';

interface TravelImageProps extends ImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  preview?: boolean | {
    mask?: string;
  };
}

const TravelImage: React.FC<TravelImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  preview = true,
  ...props
}) => {
  const combinedClassName = `travel-image ${className}`.trim();
  
  const defaultStyle: React.CSSProperties = {
    objectFit: 'cover',
    width: '100%',
    maxHeight: '350px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease',
    display: 'block',
    ...style,
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'var(--travel-primary-600)',
          borderRadius: 12,
        },
        components: {
          Image: {
            borderRadius: 12,
          },
        },
      }}
    >
      <Image
        src={src}
        alt={alt}
        className={combinedClassName}
        style={defaultStyle}
        preview={preview}
        {...props}
      />
    </ConfigProvider>
  );
};

export default TravelImage;
