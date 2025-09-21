import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { authAction } from '../../stores/actions';
import { path } from '../../utilities/path';

const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate(path.LANDING);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col h-screen">
          {/* Header Skeleton */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Skeleton.Avatar active size={32} />
                <Skeleton.Input active size="default" style={{ width: '120px', height: '24px' }} />
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Skeleton.Input active size="default" style={{ width: '150px', height: '20px' }} />
                <Skeleton.Button active size="default" style={{ width: '80px', height: '32px' }} />
              </div>
            </div>
          </header>

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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-travel-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">TN</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">TravelNest</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block">
                <span className="text-xs sm:text-sm text-gray-600">
                  Xin chào, <span className="font-medium text-gray-900">{user?.firstName || user?.userName || 'Người dùng'}</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md transform cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainPage;
