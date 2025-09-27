import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingProps {
  isVisible?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  isVisible = true,
  message = "Đang tải..."
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ease-in-out" style={{ zIndex: 1000! }}>
      {/* Loading spinner với animation */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <LoadingSpinner
            size={48}
            color="#3B82F6"
          />
        </div>

        {/* Loading text với fade animation */}
        <p className="text-gray-600 text-sm animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;
