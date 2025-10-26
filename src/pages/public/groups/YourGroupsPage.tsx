import React, { useState } from 'react';
import { MyGroupCard } from '../../../components/common/cards';

const YourGroupsPage: React.FC = () => {
  // Mock data for pending group requests
  const [pendingGroups] = useState([
    {
      id: '1',
      name: 'Du lịch Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=100&h=100&fit=crop',
      lastActivity: 'Đã yêu cầu tham gia vào 2 ngày trước'
    },
    {
      id: '2',
      name: 'Ẩm thực Việt Nam',
      avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop',
      lastActivity: 'Đã yêu cầu tham gia vào 5 ngày trước'
    }
  ]);

  // Mock data for joined groups
  const [joinedGroups] = useState([
    {
      id: '3',
      name: 'Bộ Tộc MixiGaming.',
      avatar: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 5 phút trước'
    },
    {
      id: '4',
      name: 'Cafe Đường Phố',
      avatar: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 10 phút trước'
    },
    {
      id: '5',
      name: 'Học Từ Vựng Tiếng Anh Mỗi Ngày',
      avatar: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 2 giờ trước'
    },
    {
      id: '6',
      name: 'Trường Người Ta',
      avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 5 giờ trước'
    },
    {
      id: '7',
      name: 'Phenikaa University Confession',
      avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 1 ngày trước'
    },
    {
      id: '8',
      name: 'Đẩy xã hội - Ban không thể flex, tôi cũng vậy!',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 2 ngày trước'
    },
    {
      id: '9',
      name: 'Cộng đồng Developer Việt Nam',
      avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 3 ngày trước'
    },
    {
      id: '10',
      name: 'Yêu thích phim ảnh',
      avatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop',
      lastActivity: 'Lần hoạt động gần nhất: 4 ngày trước'
    }
  ]);

  const handleViewGroup = (id: string) => {
    console.log('View group:', id);
  };

  const handleMoreOptions = (id: string) => {
    console.log('More options for group:', id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Pending Group Requests Section */}
      {pendingGroups.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            Yêu cầu tham gia nhóm đang chờ
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Các nhóm bạn đã gửi yêu cầu và đang chờ được chấp nhận
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pendingGroups.map((group) => (
              <MyGroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                avatar={group.avatar}
                lastActivity={group.lastActivity}
                onViewClick={handleViewGroup}
                onMoreClick={handleMoreOptions}
                onClick={() => console.log('Click card:', group.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Joined Groups Section */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">
          Tất cả các nhóm bạn đã tham gia ({joinedGroups.length})
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Danh sách các nhóm bạn đang là thành viên hoặc quản trị viên
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {joinedGroups.map((group) => (
            <MyGroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              avatar={group.avatar}
              lastActivity={group.lastActivity}
              onViewClick={handleViewGroup}
              onMoreClick={handleMoreOptions}
              onClick={() => console.log('Click card:', group.id)}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {joinedGroups.length === 0 && pendingGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Bạn chưa tham gia nhóm nào.</p>
        </div>
      )}
    </div>
  );
};

export default YourGroupsPage;
