import React from 'react';
import { ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 20, 
  color = "#FFFFFF" 
}) => {
  return (
    <ClipLoader
      color={color}
      size={size}
    />
  );
};

export default LoadingSpinner;