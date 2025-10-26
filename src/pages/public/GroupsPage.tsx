import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { SearchGroupDropdown } from '../../components/common/dropdowns';
import type { GroupResultItemProps } from '../../components/common/items/GroupResultItem';

const GroupsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<GroupResultItemProps[]>([
    {
      id: '1',
      name: 'Du lịch Việt Nam',
      avatar: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=60&h=60&fit=crop',
      description: 'Nhóm công khai',
      memberCount: 15420
    },
    {
      id: '2',
      name: 'Phượt Miền Tây',
      avatar: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=60&h=60&fit=crop',
      description: 'Nhóm công khai',
      memberCount: 8560
    }
  ]);

  const tabs = [
    { id: 'joined', label: 'Đã tham gia', icon: 'fluent:people-community-24-filled' },
    { id: 'discover', label: 'Khám phá', icon: 'fluent:search-24-filled' },
    { id: 'suggested', label: 'Gợi ý', icon: 'fluent:lightbulb-24-filled' }
  ];

  const handleRemoveSearch = (id: string) => {
    setRecentSearches(recentSearches.filter(item => item.id !== id));
  };

  const handleSearchItemClick = (item: GroupResultItemProps) => {
    console.log('Navigate to group:', item.name);
    // TODO: Navigate to group detail page
  };

  const joinedGroups = [
    {
      id: 1,
      name: "Du lịch Việt Nam",
      description: "Chia sẻ kinh nghiệm du lịch khắp Việt Nam",
      members: 15420,
      posts: 3240,
      avatar: "https://images.unsplash.com/photo-1528127269322-539801943592?w=60&h=60&fit=crop",
      cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=150&fit=crop",
      recentActivity: "2 giờ trước",
      isPublic: true
    },
    {
      id: 2,
      name: "Phượt Miền Tây",
      description: "Nhóm dành cho những người yêu thích phượt miền Tây",
      members: 8560,
      posts: 1890,
      avatar: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=60&h=60&fit=crop",
      cover: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=150&fit=crop",
      recentActivity: "5 giờ trước",
      isPublic: true
    },
    {
      id: 3,
      name: "Backpacker Việt Nam",
      description: "Cộng đồng backpacker chia sẻ tips và kinh nghiệm",
      members: 22340,
      posts: 4560,
      avatar: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=60&h=60&fit=crop",
      cover: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=150&fit=crop",
      recentActivity: "1 ngày trước",
      isPublic: true
    }
  ];

  const discoverGroups = [
    {
      id: 4,
      name: "Du lịch Đà Lạt",
      description: "Khám phá thành phố ngàn hoa",
      members: 12300,
      category: "Du lịch trong nước",
      avatar: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=60&h=60&fit=crop"
    },
    {
      id: 5,
      name: "Ẩm thực Việt Nam",
      description: "Chia sẻ món ăn ngon khắp Việt Nam",
      members: 18700,
      category: "Ẩm thực",
      avatar: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=60&h=60&fit=crop"
    },
    {
      id: 6,
      name: "Du lịch bền vững",
      description: "Du lịch có trách nhiệm với môi trường",
      members: 8900,
      category: "Môi trường",
      avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon icon="fluent:people-community-24-filled" className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nhóm</h1>
                <p className="text-gray-600">Kết nối với cộng đồng du lịch</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Icon icon="fluent:add-24-filled" className="h-5 w-5" />
              <span>Tạo nhóm</span>
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="fluent:search-24-filled" className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm nhóm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setShowSearchDropdown(false)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon icon={tab.icon} className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Joined Groups */}
        {activeTab === 'joined' && (
          <div className="space-y-6">
            {joinedGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-32">
                  <img
                    src={group.cover}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      group.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {group.isPublic ? 'Công khai' : 'Riêng tư'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-16 h-16 rounded-lg object-cover -mt-8 border-4 border-white"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h2>
                      <p className="text-gray-600 mb-4">{group.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Icon icon="fluent:people-24-filled" className="h-4 w-4" />
                          <span>{group.members.toLocaleString()} thành viên</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon icon="fluent:document-24-filled" className="h-4 w-4" />
                          <span>{group.posts.toLocaleString()} bài viết</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon icon="fluent:clock-24-filled" className="h-4 w-4" />
                          <span>Hoạt động {group.recentActivity}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Xem nhóm
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          Chia sẻ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discover Groups */}
        {activeTab === 'discover' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.category}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{group.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Icon icon="fluent:people-24-filled" className="h-4 w-4" />
                    <span>{group.members.toLocaleString()} thành viên</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Tham gia
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggested Groups */}
        {activeTab === 'suggested' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nhóm gợi ý cho bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=40&h=40&fit=crop"
                    alt="Suggested group"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">Du lịch Hà Nội</h3>
                    <p className="text-sm text-gray-600">15 bạn bè đã tham gia</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Tham gia nhóm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
