import React from 'react';
import Loading from './Loading';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Đang tải..." 
}) => {
  return (
    <Loading isVisible={isVisible} message={message} />
  );
};

export default LoadingOverlay;
