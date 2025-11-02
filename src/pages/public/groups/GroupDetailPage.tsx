import React from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { path } from '../../../utilities/path';

const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from current path
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.includes(`/${path.GROUP_ABOUT}`)) return 'about';
    if (pathname.includes(`/${path.GROUP_MEMBERS}`)) return 'members';
    if (pathname.includes(`/${path.GROUP_MEDIA}`)) return 'media';
    return 'discussion';
  };

  const activeTab = getActiveTab();

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    switch (tabId) {
      case 'about':
        navigate(`${path.GROUP_ABOUT}`);
        break;
      case 'discussion':
        navigate(`${path.GROUP_DETAIL}`);
        break;
      case 'members':
        navigate(`${path.GROUP_MEMBERS}`);
        break;
      case 'media':
        navigate(`${path.GROUP_MEDIA}`);
        break;
    }
  };

  const groupData = {
    id: groupId,
    name: 'Thế giới Cực sắc',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=100&h=100&fit=crop',
    isPublic: true,
    memberCount: 58000,
    members: [
      { id: 1, avatar: 'https://i.pravatar.cc/40?img=1' },
      { id: 2, avatar: 'https://i.pravatar.cc/40?img=2' },
      { id: 3, avatar: 'https://i.pravatar.cc/40?img=3' },
      { id: 4, avatar: 'https://i.pravatar.cc/40?img=4' },
      { id: 5, avatar: 'https://i.pravatar.cc/40?img=5' },
    ],
    isJoined: true,
  };

  const tabs = [
    { id: 'about', label: 'Giới thiệu', icon: 'fluent:info-24-filled' },
    { id: 'discussion', label: 'Thảo luận', icon: 'fluent:chat-24-filled' },
    { id: 'members', label: 'Mọi người', icon: 'fluent:people-24-filled' },
    { id: 'media', label: 'File phương tiện', icon: 'fluent:image-24-filled' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div>
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-b-xl bg-gray-200 max-w-[1200px] mx-auto overflow-hidden">
          <img src={groupData.coverImage} alt={groupData.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
        </div>
        <div className="bg-white">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-[50px]">
            <div className="flex items-end justify-between py-4">
              <div className="flex items-end space-x-4">
                <div className="pb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{groupData.name}</h1>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <Icon icon={groupData.isPublic ? "fluent:globe-24-filled" : "fluent:lock-closed-24-filled"} className="h-4 w-4" />
                    <span>{groupData.isPublic ? 'Nhóm công khai' : 'Nhóm riêng tư'}</span>
                    <span></span>
                    <span>{groupData.memberCount.toLocaleString()} thành viên</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 pb-2 flex-wrap sm:flex-nowrap">
                <div className="flex -space-x-2 mr-2">
                  {groupData.members.slice(0, 5).map((member, index) => (
                    <img key={member.id} src={member.avatar} alt="Member" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white" style={{ zIndex: 5 - index }} />
                  ))}
                </div>
                {groupData.isJoined ? (
                  <>
                    <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm">
                      <Icon icon="fluent:checkmark-24-filled" className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Đã tham gia</span>
                      <span className="sm:hidden">Joined</span>
                    </button>
                    <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                      <Icon icon="fluent:share-24-filled" className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Chia sẻ</span>
                    </button>
                  </>
                ) : (
                  <button className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                    <Icon icon="fluent:add-24-filled" className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Tham gia nhóm</span>
                  </button>
                )}
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Icon icon="fluent:search-24-filled" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </button>
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Icon icon="fluent:more-horizontal-24-filled" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </button>
              </div>
            </div>
            <div className="flex space-x-1 mt-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex cursor-pointer items-center space-x-2 px-3 sm:px-4 py-3 font-medium transition-colors flex-shrink-0 whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <Icon icon={tab.icon} className="h-5 w-5" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 sm:px-6 lg:px-[50px] py-4 sm:py-6 lg:py-8 mx-auto max-w-[1200px]">
        <Outlet />
      </div>
    </div>
  );
};

export default GroupDetailPage;
