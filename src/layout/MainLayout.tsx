import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { Header, ChatWidget } from '../components/common';
import webSocketService from '../services/webSocketService';

interface MainLayoutProps {
  children?: React.ReactNode;
  showLoading?: boolean;
  loadingDuration?: number;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showLoading = false, 
  loadingDuration = 800 
}) => {
  const [isLoading, setIsLoading] = useState(showLoading);
  const wsConnectedRef = useRef(false);
  
  // Get auth info from Redux
  const { token, userId } = useSelector((state: any) => ({
    token: state.auth?.token,
    userId: state.auth?.userId
  }));

  // Simulate loading for demonstration
  useEffect(() => {
    if (showLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, loadingDuration);
      return () => clearTimeout(timer);
    }
  }, [showLoading, loadingDuration]);

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {    if (!token || !userId) {      return;
    }
    
    if (wsConnectedRef.current) {      return;
    }

    const connectWebSocket = async () => {
      try {        await webSocketService.connect(token, userId);
        wsConnectedRef.current = true;      } catch (error) {
        console.error('❌ MainLayout: WebSocket connection failed:', error);
        wsConnectedRef.current = false;
      }
    };

    connectWebSocket();

    // Cleanup on unmount or when auth changes
    return () => {
      if (wsConnectedRef.current) {        webSocketService.disconnect();
        wsConnectedRef.current = false;
      }
    };
  }, [token, userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col h-screen">
          {/* Header Skeleton */}
          <div className="bg-white shadow-sm border-b border-gray-200 h-14">
            <div className="w-full px-4 h-full flex items-center justify-between">
              {/* Logo - giống header landing */}
              <div className="flex items-center space-x-3 flex-1 max-w-md">
                <div className="w-8 h-8 bg-travel-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">TN</span>
                </div>
                {/* Search Bar Skeleton - Desktop */}
                <div className="hidden md:block">
                  <Skeleton.Input active size="default" style={{ width: '200px', height: '32px' }} />
                </div>
                {/* Search Button Skeleton - Mobile */}
                <div className="md:hidden">
                  <Skeleton.Avatar active size={40} />
                </div>
              </div>

              {/* Center Section Skeleton - Hidden on Mobile */}
              <div className="hidden lg:flex items-center justify-center space-x-1 flex-1 max-w-4xl">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton.Input key={i} active size="default" style={{ width: '120px', height: '40px' }} />
                ))}
              </div>

              {/* Right Section Skeleton */}
              <div className="flex items-center space-x-2 flex-1 justify-end max-w-md">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton.Avatar key={i} active size={40} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <main className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <Skeleton.Input active size="large" style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input active size="default" style={{ width: '80%', height: '20px' }} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                    <Skeleton.Input active size="default" style={{ width: '100%', height: '20px', marginBottom: '8px' }} />
                    <Skeleton.Input active size="default" style={{ width: '80%', height: '16px' }} />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>

        {/* Chat Widget - Fixed at bottom right */}
        <ChatWidget />
      </div>
    </div>
  );
};

export default MainLayout;
