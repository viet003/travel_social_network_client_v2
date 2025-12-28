import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { TravelButton } from '../../../components/ui/customize';
import { useNavigate, useLocation } from 'react-router-dom';
import { path } from '../../../utilities/path';
import { Outlet } from 'react-router-dom';
import VideoCreateModal from '../../../components/modal/watch/WatchCreateModal';

const WatchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCreateSuccess = () => {
    navigate(`${path.MY_VIDEOS}`);
  };

  // Categories data
  const categories: Array<{
    id: string;
    label: string;
    icon: string;
    path: string | null;
  }> = [
    {
      id: 'for-you',
      label: 'Dành cho bạn',
      icon: 'fluent:star-24-filled',
      path: '/home/watch',
    },
    {
      id: 'trending',
      label: 'Thịnh hành',
      icon: 'fluent:flash-24-filled',
      path: '/home/watch/trending',
    },
    {
      id: 'my-videos',
      label: 'Video của bạn',
      icon: 'fluent:video-person-24-filled',
      path: '/home/watch/my-videos',
    },
    {
      id: 'live',
      label: 'Video trực tiếp',
      icon: 'fluent:live-24-filled',
      path: null,
    },
    {
      id: 'saved',
      label: 'Video đã lưu',
      icon: 'fluent:bookmark-24-filled',
      path: '/home/watch/saved',
    },
    {
      id: 'history',
      label: 'Đã xem',
      icon: 'fluent:history-24-filled',
      path: '/home/watch/history',
    },
  ];

  const isActiveCategory = (categoryPath: string | null) => {
    if (!categoryPath) return false;
    if (categoryPath === '/home/watch') {
      return location.pathname === '/home/watch';
    }
    return location.pathname.startsWith(categoryPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Video Create Modal */}
      <VideoCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden cursor-pointer rounded-full hover:bg-gray-100 p-2 text-gray-600 active:text-blue-600 transition-colors"
              >
                <Icon icon="fluent:navigation-24-filled" className="h-6 w-6" />
              </button>
              
              <Icon icon="fluent:play-24-filled" className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Watch
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <TravelButton 
                type="default"
                className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base hover:!bg-gray-100 transition-colors duration-200"
                onClick={() => navigate(`${path.MY_VIDEOS}`)}
              >
                <Icon icon="fluent:video-person-24-filled" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Video của bạn</span>
                <span className="inline sm:hidden">Video</span>
              </TravelButton>
              <TravelButton 
                type="primary"
                className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Icon icon="fluent:add-24-filled" className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Tạo video</span>
                <span className="inline sm:hidden">Tạo</span>
              </TravelButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Sidebar - Categories */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-64 xl:w-72
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex-shrink-0
          `}>
            <div className="h-full lg:h-auto bg-white lg:bg-white/60 lg:backdrop-blur-sm rounded-none lg:rounded-2xl border-r lg:border border-gray-200/50 p-4 sm:p-5 lg:sticky lg:top-20 overflow-y-auto">
              {/* Mobile Close Button */}
              <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50">
                <h2 className="text-2xl font-bold text-black">Danh mục</h2>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 text-gray-500 active:text-gray-700"
                >
                  <Icon icon="fluent:dismiss-24-filled" className="h-5 w-5" />
                </button>
              </div>

              <h2 className="hidden lg:block text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Danh mục
              </h2>
              
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (category.path) {
                        navigate(category.path);
                      }
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-50 cursor-pointer ${
                      isActiveCategory(category.path)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'text-black bg-gray-50/50 hover:bg-gray-100 active:bg-gray-100/80'
                    }`}
                  >
                    <Icon 
                      icon={category.icon} 
                      className={`h-6 w-6 flex-shrink-0 transition-transform duration-200 ${
                        isActiveCategory(category.path) ? 'text-white' : 'text-black group-hover:scale-110'
                      }`}
                    />
                    <span className="font-medium text-xs sm:text-sm">{category.label}</span>
                  </button>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-4 sm:my-5 border-t border-gray-200/50"></div>

              {/* Additional Info */}
              <div className="text-[11px] text-gray-500">
                <p className="font-semibold text-[14px] text-gray-700 mb-1">Khám phá</p>
                <p className="cursor-pointer active:text-blue-600 transition-colors">Trợ giúp</p>
                <p className="cursor-pointer active:text-blue-600 transition-colors">Điều khoản</p>
                <p className="cursor-pointer active:text-blue-600 transition-colors">Quyền riêng tư</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4 sm:p-6 min-h-[calc(100vh-12rem)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;