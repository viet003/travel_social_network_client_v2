import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LeftSidebar, RightSidebar } from '../../components/common';
import { PostCreateModal, PostModal } from '../../components/modal/post';
import { authAction } from '../../stores/actions';
import { path } from '../../utilities/path';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate(path.LANDING);
  };

  // Mock posts data
  const mockPosts = [
    {
      id: "1",
      content: "Vừa khám phá Hội An - một thành phố cổ kính tuyệt đẹp! Những ngôi nhà màu vàng, đèn lồng đỏ rực rỡ và ẩm thực đặc sản làm tôi mê mẩn. Đặc biệt là món cao lầu và bánh mì Phượng, ngon không thể tả! 🌟",
      media: [
        {
          id: "media1",
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
          type: "IMAGE" as const
        },
        {
          id: "media2", 
          url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=500&h=300&fit=crop",
          type: "IMAGE" as const
        }
      ],
      location: "Hội An, Việt Nam",
      tags: ["du lịch", "Hội An", "ẩm thực"],
      privacy: "public",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: {
        id: "user1",
        name: "Nguyễn Minh Anh",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      group: null,
      comments: [],
      onComment: () => {},
      likeCount: 24,
      commentCount: 8,
      shareCount: 3,
      isLiked: false,
      setIsLiked: () => {},
      setPostLikeCount: () => {},
      setPostCommentCount: () => {},
      setPostShareCount: () => {}
    },
    {
      id: "2", 
      content: "Sapa vào mùa lúa chín vàng rực rỡ! Những thửa ruộng bậc thang như những chiếc thang trời, khung cảnh thật ngoạn mục. Khí hậu mát mẻ, không khí trong lành - đúng là thiên đường cho những ai muốn tránh xa ồn ào thành thị. 🏔️",
      media: [
        {
          id: "media3",
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop", 
          type: "IMAGE" as const
        }
      ],
      location: "Sapa, Lào Cai",
      tags: ["Sapa", "ruộng bậc thang", "du lịch"],
      privacy: "public",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      user: {
        id: "user2",
        name: "Trần Văn Hùng",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      },
      group: null,
      comments: [],
      onComment: () => {},
      likeCount: 156,
      commentCount: 23,
      shareCount: 12,
      isLiked: true,
      setIsLiked: () => {},
      setPostLikeCount: () => {},
      setPostCommentCount: () => {},
      setPostShareCount: () => {}
    },
    {
      id: "3",
      content: "Phú Quốc không chỉ có biển xanh cát trắng mà còn có những khu rừng nguyên sinh tuyệt đẹp! Vừa đi trekking trong Vườn Quốc gia Phú Quốc, gặp được rất nhiều động vật hoang dã. Cảm giác được hòa mình vào thiên nhiên thật tuyệt vời! 🌴🐒",
      media: [
        {
          id: "media4",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
          type: "IMAGE" as const
        },
        {
          id: "media5",
          url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop", 
          type: "IMAGE" as const
        },
        {
          id: "media6",
          url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=500&h=300&fit=crop",
          type: "IMAGE" as const
        }
      ],
      location: "Phú Quốc, Kiên Giang",
      tags: ["Phú Quốc", "trekking", "thiên nhiên"],
      privacy: "public", 
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: "user3",
        name: "Lê Thị Mai",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      },
      group: null,
      comments: [],
      onComment: () => {},
      likeCount: 89,
      commentCount: 15,
      shareCount: 7,
      isLiked: false,
      setIsLiked: () => {},
      setPostLikeCount: () => {},
      setPostCommentCount: () => {},
      setPostShareCount: () => {}
    }
  ];

  return (
    <div className="flex">
      {/* Left Sidebar - Hidden on mobile and tablet */}
      <div className="hidden lg:block">
        <LeftSidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 min-h-screen py-6">
        <div className="max-w-2xl mx-auto">
          {/* Post Create Modal */}
          <PostCreateModal 
            location="home"
            setCreateSuccess={(success) => {
              if (success) {
                console.log('Post created successfully!');
                // You can add logic here to refresh the feed or show a success message
              }
            }}
          />

          {/* Mock Posts Feed */}
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <PostModal
                key={post.id}
                postId={post.id}
                userId={post.user.id}
                avatar={post.user.avatar}
                userName={post.user.name}
                location={post.location}
                timeAgo={post.createdAt}
                content={post.content}
                mediaList={post.media}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                shareCount={post.shareCount}
                tags={post.tags}
                privacy={post.privacy}
                group={post.group}
                comments={post.comments}
                onImageClick={() => {}}
                onShare={() => {}}
                onComment={() => {}}
                liked={post.isLiked}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile and tablet */}
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;