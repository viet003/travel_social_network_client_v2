import React, { useEffect, useCallback, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { path } from '../utilities/path';
import { formatTimeAgo } from '../utilities/helper';
import { SearchGroupDropdown } from '../components/common/dropdowns';
import { GroupCreateModal } from '../components/modal';
import { apiGetMyGroups } from '../services/groupService';
import type { GroupResponse } from '../types/group.types';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../components/ui/loading';

const GroupLayout: React.FC = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);

  // API state for user's groups
  const [joinedGroups, setJoinedGroups] = React.useState<GroupResponse[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user's groups
  const fetchMyGroups = useCallback(async (page: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await apiGetMyGroups(page, 5);
      const { content, totalPages: total } = response.data;
      
      if (page === 0) {
        setJoinedGroups(content);
      } else {
        setJoinedGroups(prev => [...prev, ...content]);
      }
      
      setTotalPages(total);
      setCurrentPage(page);
      setHasMore(page < total - 1);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Không thể tải danh sách nhóm');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Initial load
  useEffect(() => {
    fetchMyGroups(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll handler (scroll to top to load more)
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoading || !hasMore) return;

    // Check if scrolled to top
    if (container.scrollTop === 0 && currentPage < totalPages - 1) {
      fetchMyGroups(currentPage + 1);
    }
  }, [currentPage, totalPages, hasMore, isLoading, fetchMyGroups]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  return (
    <div className="bg-gray-50 flex min-h-[calc(100vh-55px)] relative">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle Button for Mobile - Fixed position */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-[72px] left-4 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Icon 
          icon={isSidebarOpen ? "fluent:dismiss-24-filled" : "fluent:navigation-24-filled"} 
          className="h-6 w-6 text-gray-700" 
        />
      </button>

      {/* Left Sidebar */}
      <div className={`
        w-90 bg-white border-r border-gray-200 
        flex flex-col h-[calc(100vh-56px)]
        fixed lg:sticky top-[56px] lg:top-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 p-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Nhóm</h1>
            <button 
              className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
              onClick={() => {/* Handle settings click */}}
            >
              <Icon icon="fluent:settings-24-filled" className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Icon 
              icon="fluent:search-24-regular" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 z-10"
            />
            <input
              type="text"
              placeholder="Tìm kiếm nhóm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setShowSearchDropdown(false)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Search Dropdown */}
            {showSearchDropdown && searchQuery.trim() && (
              <SearchGroupDropdown
                searchQuery={searchQuery}
                onClose={() => setShowSearchDropdown(false)}
              />
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1" ref={scrollContainerRef}>
          {/* Navigation Menu */}
          <div className="px-2">
            <nav className="space-y-1">
              <NavLink
                to={path.GROUPS_FEEDS}
                end
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2.5 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <Icon 
                        icon="fluent:grid-24-filled" 
                        className={`h-5 w-5 ${isActive ? 'text-white' : 'text-black'}`}
                      />
                    </div>
                    <span className={`font-medium text-[15px] text-black`}>
                      Bảng feed của bạn
                    </span>
                  </>
                )}
              </NavLink>

              <NavLink
                to={path.GROUPS_DISCOVER}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2.5 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <Icon 
                        icon="fluent:compass-northwest-24-filled" 
                        className={`h-5 w-5 ${isActive ? 'text-white' : 'text-black'}`}
                      />
                    </div>
                    <span className={`font-medium text-[15px] text-black`}>
                      Khám phá
                    </span>
                  </>
                )}
              </NavLink>

              <NavLink
                to={path.YOUR_GROUPS}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2.5 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <Icon 
                        icon="fluent:people-community-24-filled" 
                        className={`h-5 w-5 ${isActive ? 'text-white' : 'text-black'}`}
                      />
                    </div>
                    <span className={`font-medium text-[15px] text-black`}>
                      Nhóm của bạn
                    </span>
                  </>
                )}
              </NavLink>
            </nav>

            {/* Create New Group Button */}
            <div className="w-full mt-3 mb-4">
              <GroupCreateModal />
            </div>
          </div>

          {/* Groups You've Joined */}
          <div className="flex-1">
            <div className="px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-[17px] text-gray-900">Nhóm bạn đã tham gia</h2>
              <button 
                onClick={() => navigate(path.YOUR_GROUPS)}
                className="text-blue-600 hover:text-blue-700 text-[15px] font-medium cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="px-2 pb-4 space-y-1">
              {isLoading && joinedGroups.length === 0 ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size={24} color="#2563eb" />
                </div>
              ) : joinedGroups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Bạn chưa tham gia nhóm nào</p>
                </div>
              ) : (
                <>
                  {joinedGroups.map((group) => (
                    <div 
                      key={group.groupId}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/home/groups/${group.groupId}`)}
                    >
                      <img 
                        src={group.coverImageUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop'} 
                        alt={group.groupName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[15px] text-gray-900 truncate">{group.groupName}</h3>
                        <p className="text-[13px] text-gray-500 truncate">
                          Hoạt động: {formatTimeAgo(group.lastActivityAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && currentPage > 0 && (
                    <div className="flex justify-center py-2">
                      <LoadingSpinner size={20} color="#2563eb" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Outlet */}
      <div className="flex-1 bg-gray-50 w-full lg:w-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default GroupLayout;