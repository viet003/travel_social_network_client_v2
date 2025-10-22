import React from 'react';
import FriendCard from '../../../components/common/cards/FriendCard';

const FriendSuggestionsPage: React.FC = () => {
  // Mock data for friend suggestions
  const suggestions = [
    {
      id: 1,
      name: "Mai Phương",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 15,
      reason: "Bạn bè của Nguyễn Văn A"
    },
    {
      id: 2,
      name: "Hoàng Tuấn",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 7,
      reason: "Cùng học tại Đại học Bách Khoa"
    },
    {
      id: 3,
      name: "Linh Chi",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 10,
      reason: "Sống tại Hà Nội"
    },
    {
      id: 4,
      name: "Minh Đức",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 4,
      reason: "Làm việc tại FPT Software"
    },
    {
      id: 5,
      name: "Thu Hà",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 9,
      reason: "Bạn bè của Trần Thị B"
    },
    {
      id: 6,
      name: "Quốc Anh",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 6,
      reason: "Thích du lịch"
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black mb-2">Những người bạn có thể biết</h2>
        <p className="text-gray-600 text-sm">Gợi ý dựa trên bạn chung, nơi làm việc, học tập và nhiều hơn nữa</p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {suggestions.map((suggestion) => (
          <FriendCard
            key={suggestion.id}
            id={suggestion.id}
            name={suggestion.name}
            avatar={suggestion.avatar}
            mutualFriends={suggestion.mutualFriends}
            reason={suggestion.reason}
            primaryAction={{
              label: 'Thêm bạn bè',
              onClick: () => console.log('Add friend', suggestion.id)
            }}
            secondaryAction={{
              label: 'Gỡ',
              onClick: () => console.log('Remove', suggestion.id)
            }}
            onCardClick={() => console.log('View profile', suggestion.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestionsPage;
