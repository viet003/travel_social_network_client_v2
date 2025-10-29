import React from 'react';
import { Icon } from '@iconify/react';
import { PostModal } from '../../../components/modal/post'; // Đường dẫn tương đối đến PostModal

const GroupFeedsPage: React.FC = () => {
  // Mock data for posts - giả lập các bài viết trong group
  const mockPosts = [
    {
      postId: "1",
      userId: "user1",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      userName: "Nguyễn Văn A",
      location: "Hà Nội",
      timeAgo: "2024-10-23T10:30:00Z",
      content: "Vừa có chuyến du lịch Hạ Long tuyệt vời! Phong cảnh đẹp không thể tả. Mọi người nên thử trải nghiệm một lần 🌊⛵",
      mediaList: [
        {
          type: "IMAGE" as const,
          url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop"
        },
        {
          type: "IMAGE" as const,
          url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop"
        }
      ],
      likeCount: 45,
      commentCount: 12,
      shareCount: 5,
      tags: ["HaLong", "DuLich", "VietNam"],
      privacy: "Công khai",
      group: {
        groupId: "1",
        groupName: "Nhóm Du Lịch Việt Nam",
        coverImageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=face"
      },
      liked: false
    },
    {
      postId: "2",
      userId: "user2",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      userName: "Trần Thị B",
      location: "Đà Nẵng",
      timeAgo: "2024-10-23T08:15:00Z",
      content: "Chia sẻ kinh nghiệm đi Sapa mùa lúa chín. Cảnh đẹp mê hồn, không khí trong lành. Recommend mọi người đi vào tháng 9-10 nhé! 🌾🏔️",
      mediaList: [
        {
          type: "IMAGE" as const,
          url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop"
        }
      ],
      likeCount: 89,
      commentCount: 23,
      shareCount: 8,
      tags: ["Sapa", "MuaLuaChin", "TayBac"],
      privacy: "Công khai",
      group: {
        groupId: "2",
        groupName: "Chia sẻ kinh nghiệm du lịch",
        coverImageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
      },
      liked: true
    },
    {
      postId: "3",
      userId: "user3",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      userName: "Lê Văn C",
      location: "TP. Hồ Chí Minh",
      timeAgo: "2024-10-22T15:45:00Z",
      content: "Video hành trình phượt xuyên Việt của team mình. 30 ngày, 3000km, biết bao kỷ niệm đẹp! 🏍️🇻🇳",
      mediaList: [
        {
          type: "VIDEO" as const,
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      ],
      likeCount: 156,
      commentCount: 45,
      shareCount: 34,
      tags: ["Phuot", "XuyenViet", "MotorbikeTrip"],
      privacy: "Công khai",
      group: {
        groupId: "3",
        groupName: "Phượt thủ xuyên Việt",
        coverImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      liked: false
    }
  ];

  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleImageClick = (img: string, index: number) => {
    console.log('Image clicked:', img, index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-black mb-2">Bảng Feeds của bạn</h2>
            <p className="text-gray-600 text-sm">Cùng khám phá những bài viết mới nhất từ cộng đồng mà bạn quan tâm.</p>
          </div>

        </div>

        {/* Posts Feed Section */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <PostModal
              key={post.postId}
              postId={post.postId}
              userId={post.userId}
              avatar={post.avatar}
              userName={post.userName}
              location={post.location}
              timeAgo={post.timeAgo}
              content={post.content}
              mediaList={post.mediaList}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              shareCount={post.shareCount}
              tags={post.tags}
              privacy={post.privacy}
              group={post.group}
              onShare={handleShare}
              onImageClick={handleImageClick}
              liked={post.liked}
            />
          ))}
        </div>

        {/* Empty State - hiển thị khi không có bài viết */}
        {mockPosts.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Icon icon="fluent:document-empty-24-regular" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-600 mb-4">Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Tạo bài viết đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupFeedsPage;