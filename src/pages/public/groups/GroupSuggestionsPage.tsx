import React, { useState } from 'react';
import { OtherGroupCard } from '../../../components/common/cards';

const GroupSuggestionsPage: React.FC = () => {
  // Mock data for friend's groups
  const [friendGroups] = useState([
    {
      id: '1',
      name: 'Du lịch Hà Nội',
      coverImage: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400&h=300&fit=crop',
      memberCount: 15000,
      postsPerDay: 25,
      friendMembers: [
        { name: 'Nguyễn Văn A', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop' },
        { name: 'Trần Thị B', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop' },
        { name: 'Lê Văn C', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop' }
      ]
    },
    {
      id: '2',
      name: 'Ẩm thực Việt Nam',
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      memberCount: 28000,
      postsPerDay: 50,
      friendMembers: [
        { name: 'Phạm Thị D', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop' },
        { name: 'Mai Phương', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=50&h=50&fit=crop' }
      ]
    },
    {
      id: '3',
      name: 'Cộng đồng Developer Việt Nam',
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      memberCount: 45000,
      postsPerDay: 80,
      friendMembers: [
        { name: 'Hoàng Tuấn', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop' }
      ]
    },
    {
      id: '4',
      name: 'Photography Lovers',
      coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
      memberCount: 32000,
      postsPerDay: 40,
      friendMembers: [
        { name: 'Linh Chi', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop' },
        { name: 'Minh Đức', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop' }
      ]
    }
  ]);

  // Mock data for other suggestions
  const [otherSuggestions] = useState([
    {
      id: '5',
      name: 'Hội Phượt Sài Gòn',
      coverImage: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=400&h=300&fit=crop',
      memberCount: 18000,
      postsPerDay: 35,
      friendMembers: []
    },
    {
      id: '6',
      name: 'Học tiếng Anh cùng nhau',
      coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
      memberCount: 52000,
      postsPerDay: 90,
      friendMembers: []
    },
    {
      id: '7',
      name: 'Yêu thích thú cưng',
      coverImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
      memberCount: 24000,
      postsPerDay: 45,
      friendMembers: []
    },
    {
      id: '8',
      name: 'Sống khỏe mỗi ngày',
      coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      memberCount: 38000,
      postsPerDay: 60,
      friendMembers: []
    },
    {
      id: '9',
      name: 'Đam mê công nghệ',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      memberCount: 41000,
      postsPerDay: 75,
      friendMembers: []
    },
    {
      id: '10',
      name: 'Làm vườn ban công',
      coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
      memberCount: 16000,
      postsPerDay: 20,
      friendMembers: []
    }
  ]);

  const handleJoinGroup = (id: string) => {
    console.log('Join group:', id);
  };

  const handleClickGroup = () => {
    console.log('View group details');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Friend's Groups Section */}
      {friendGroups.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            Nhóm của bạn bè
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Các nhóm có bạn bè của bạn tham gia
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friendGroups.map((group) => (
              <OtherGroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                coverImage={group.coverImage}
                memberCount={group.memberCount}
                postsPerDay={group.postsPerDay}
                friendMembers={group.friendMembers}
                onJoinClick={handleJoinGroup}
                onClick={handleClickGroup}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Suggestions Section */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">
          Gợi ý khác
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Các nhóm phù hợp với sở thích và hoạt động của bạn
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {otherSuggestions.map((group) => (
            <OtherGroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              coverImage={group.coverImage}
              memberCount={group.memberCount}
              postsPerDay={group.postsPerDay}
              friendMembers={group.friendMembers}
              onJoinClick={handleJoinGroup}
              onClick={handleClickGroup}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {friendGroups.length === 0 && otherSuggestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không có gợi ý nhóm nào.</p>
        </div>
      )}
    </div>
  );
};

export default GroupSuggestionsPage;
