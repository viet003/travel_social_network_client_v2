import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { path } from '../utilities/path';
import { SearchGroupDropdown } from '../components/common/dropdowns';
import type { GroupResultItemProps } from '../components/common/items/GroupResultItem';
// import { subLogo } from '../assets/images';

const GroupLayout: React.FC = () => {
  // const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<GroupResultItemProps[]>([
    {
      id: '1',
      name: 'Cafe Đường Phố',
      avatar: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=60&h=60&fit=crop',
      description: 'Nhóm công khai',
      memberCount: 2500
    },
    {
      id: '2',
      name: 'Học Từ Vựng Tiếng Anh Mỗi Ngày',
      avatar: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=60&h=60&fit=crop',
      description: 'Nhóm công khai',
      memberCount: 5000
    },
    {
      id: '3',
      name: 'Trường Người Ta',
      avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=60&h=60&fit=crop',
      description: 'Nhóm công khai',
      memberCount: 8900
    }
  ]);
  
  const handleRemoveSearch = (id: string) => {
    setRecentSearches(recentSearches.filter(item => item.id !== id));
  };

  const handleSearchItemClick = (item: GroupResultItemProps) => {
    console.log('Navigate to group:', item.name);
    // TODO: Navigate to group detail page
  };
  
  
  // Sample groups data
  const joinedGroups = [
    { 
      id: 1,
      name: 'Cafe Đường Phố', 
      activity: 'Lần hoạt động gần nhất: 5 phút trước', 
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop' 
    },
    { 
      id: 2,
      name: 'Học Từ Vựng Tiếng Anh Mỗi Ngày', 
      activity: 'Lần hoạt động gần nhất: 10 giờ trước', 
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&h=100&fit=crop' 
    },
    { 
      id: 3,
      name: 'Trường Người Ta', 
      activity: 'Lần hoạt động gần nhất: vài giây trước', 
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop' 
    },
    { 
      id: 4,
      name: 'Phenikaa University Confession', 
      activity: 'Lần hoạt động gần nhất: 3 năm trước', 
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=100&h=100&fit=crop' 
    },
    { 
      id: 5,
      name: 'Đẩy xã hội - Ban không thể flex, tôi cũng vậy!', 
      activity: 'Lần hoạt động gần nhất: 10 giờ trước', 
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop' 
    }
  ];

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
        className="lg:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Icon 
          icon={isSidebarOpen ? "fluent:dismiss-24-filled" : "fluent:navigation-24-filled"} 
          className="h-6 w-6 text-gray-700" 
        />
      </button>

      {/* Left Sidebar */}
      <div className={`
        w-90 bg-white border-r border-gray-200 
        flex flex-col h-[calc(100vh-55px)]
        fixed lg:sticky top-0 z-40
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
            {showSearchDropdown && (
              <SearchGroupDropdown
                searchResults={recentSearches}
                onRemove={handleRemoveSearch}
                onItemClick={handleSearchItemClick}
                onClose={() => setShowSearchDropdown(false)}
              />
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
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
            <button className="w-full mt-3 mb-4 mx-auto flex items-center justify-center space-x-2 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
              <Icon icon="fluent:add-24-filled" className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-[15px] text-blue-600">Tạo nhóm mới</span>
            </button>
          </div>

          {/* Groups You've Joined */}
          <div className="flex-1">
            <div className="px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-[17px] text-gray-900">Nhóm bạn đã tham gia</h2>
              <button className="text-blue-600 hover:text-blue-700 text-[15px] font-medium cursor-pointer">
                Xem tất cả
              </button>
            </div>

            <div className="px-2 pb-4 space-y-1">
              {joinedGroups.map((group) => (
                <div 
                  key={group.id}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <img 
                    src={group.image} 
                    alt={group.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[15px] text-gray-900 truncate">{group.name}</h3>
                    <p className="text-[13px] text-gray-500 truncate">{group.activity}</p>
                  </div>
                </div>
              ))}
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