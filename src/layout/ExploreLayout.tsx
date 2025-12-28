import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { path } from '../utilities/path';
import { SearchBlogDropdown } from '../components/common/dropdowns/search';

const ExploreLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`${path.HOME}/${path.EXPLORE_SEARCH}?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      setShowSearchDropdown(false);
      navigate(`${path.HOME}/${path.EXPLORE_SEARCH}?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const categories = [
    {
      id: "featured",
      path: path.EXPLORE_FEATURED,
      label: "Khám phá",
      icon: "fluent:globe-24-filled",
    },
    {
      id: "experiences",
      path: path.EXPLORE_EXPERIENCES,
      label: "Trải nghiệm & Review",
      icon: "fluent:star-24-filled",
    },
    {
      id: "destinations",
      path: path.EXPLORE_USER_POSTS,
      label: "Bài viết của bạn",
      icon: "fluent:document-text-24-filled",
    },
    {
      id: "itineraries",
      path: path.EXPLORE_USER_ITINERARIES,
      label: "Lịch trình của bạn",
      icon: "fluent:map-24-filled",
    },
    {
      id: "tips",
      path: path.EXPLORE_GUIDES,
      label: "Cẩm nang du lịch",
      icon: "fluent:book-24-filled",
    },
    {
      id: "seasonal",
      path: path.EXPLORE_SEASONAL,
      label: "Theo mùa & thời tiết",
      icon: "fluent:weather-partly-cloudy-day-24-filled",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden cursor-pointer rounded-full hover:bg-gray-100 p-2 text-gray-600 active:text-blue-600 transition-colors"
              >
                <Icon icon="fluent:navigation-24-filled" className="h-6 w-6" />
              </button>

              <Icon
                icon="fluent:globe-search-24-filled"
                className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Khám phá
              </h1>
            </div>

            {/* Right Section - Search */}
            <div className="flex items-center">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  className="w-40 sm:w-64 px-3 sm:px-4 py-2 pl-9 sm:pl-10 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                />
                <Icon
                  icon="fluent:search-24-filled"
                  className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                />
                
                {/* Search Dropdown */}
                {showSearchDropdown && searchQuery.trim() && (
                  <SearchBlogDropdown
                    searchQuery={searchQuery}
                    onClose={() => {
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Sidebar - Categories */}
          <aside
            className={`
            fixed lg:static inset-y-0 left-0 z-10 w-64 sm:w-72 lg:w-64 xl:w-72
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            flex-shrink-0
          `}
          >
            <div className="h-full lg:h-auto bg-white lg:bg-white/60 lg:backdrop-blur-sm rounded-none lg:rounded-2xl border-r lg:border border-gray-200/50 p-4 sm:p-5 lg:sticky lg:top-20 overflow-y-auto">
              {/* Mobile Close Button */}
              <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50">
                <h2 className="text-2xl font-bold text-black">Danh mục</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
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
                  <NavLink
                    key={category.id}
                    to={category.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-50 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "text-black bg-gray-50/50 hover:bg-gray-100 active:bg-gray-100/80"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          icon={category.icon}
                          className={`h-6 w-6 flex-shrink-0 transition-transform duration-200 ${
                            isActive
                              ? "text-white"
                              : "text-black"
                          }`}
                        />
                        <span className="font-medium text-xs sm:text-sm">
                          {category.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-4 sm:my-5 border-t border-gray-200/50"></div>

              {/* Additional Info */}
              <div className="text-[11px] text-gray-500">
                <p className="font-semibold text-[14px] text-gray-700 mb-1">
                  Thông tin
                </p>
                <p className="cursor-pointer active:text-blue-600 transition-colors">
                  Trợ giúp
                </p>
                <p className="cursor-pointer active:text-blue-600 transition-colors">
                  Điều khoản
                </p>
                <p className="cursor-pointer active:text-blue-600 transition-colors">
                  Quyền riêng tư
                </p>
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

export default ExploreLayout;
