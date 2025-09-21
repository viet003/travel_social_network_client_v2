import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authAction } from '../../stores/actions';
import { path } from '../../utilities/path';

const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate(path.LANDING);
  };

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
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md transform"
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
