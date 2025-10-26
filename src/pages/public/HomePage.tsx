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
      content: `<p><strong>Vừa khám phá Hội An - một thành phố cổ kính tuyệt đẹp!</strong> 🌟</p>
<p>Những ngôi nhà màu vàng, đèn lồng đỏ rực rỡ và ẩm thực đặc sản làm tôi mê mẩn. Đặc biệt là món <em>cao lầu</em> và <em>bánh mì Phượng</em>, ngon không thể tả!</p>
<p>Hội An thực sự là một <strong>điểm đến tuyệt vời</strong> cho những ai yêu thích văn hóa và lịch sử. Từng con phố cổ đều mang trong mình câu chuyện riêng, từng ngôi nhà đều toát lên nét kiến trúc độc đáo pha trộn giữa Việt Nam, Nhật Bản và Trung Quốc.</p>
<p>Buổi tối đi dạo bên bờ sông Hoài, ngắm đèn lồng lung linh rực rỡ phản chiếu trên mặt nước, cảm giác thật yên bình và lãng mạn. Không khí mát mẻ, tiếng nhạc truyền thống du dương, và mùi hương thơm từ những quán ăn ven đường khiến tôi không muốn rời xa nơi đây! 💕</p>`,
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
      content: `<h3>🏔️ Sapa - Thiên đường của những ruộng bậc thang</h3>
<p>Sapa vào mùa lúa chín vàng rực rỡ! Những thửa ruộng bậc thang như những <strong>chiếc thang trời</strong>, khung cảnh thật ngoạn mục.</p>
<p>Khí hậu mát mẻ, không khí trong lành - đúng là thiên đường cho những ai muốn tránh xa ồn ào thành thị.</p>
<ul>
<li>Leo núi Fansipan - <em>"Nóc nhà Đông Dương"</em></li>
<li>Thăm các bản làng dân tộc thiểu số</li>
<li>Thưởng thức ẩm thực đặc sản như cá hồi, măng chua, và thịt trâu gác bếp</li>
<li>Chụp ảnh với những thửa ruộng bậc thang tuyệt đẹp</li>
</ul>
<p>Đặc biệt, được giao lưu và tìm hiểu về văn hóa của người H'Mông, Dao Đỏ thật thú vị. Họ rất hiền lành và mến khách, luôn sẵn sàng chia sẻ về cuộc sống và truyền thống của mình. Tôi đã mua được vài món đồ thủ công mỹ nghệ rất đẹp làm quà! �</p>`,
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
      content: `<h3>🌴 Khám phá Phú Quốc - Đảo Ngọc của Việt Nam 🐒</h3>
<p><strong>Phú Quốc không chỉ có biển xanh cát trắng</strong> mà còn có những khu rừng nguyên sinh tuyệt đẹp!</p>
<p>Vừa đi trekking trong <em>Vườn Quốc gia Phú Quốc</em>, gặp được rất nhiều động vật hoang dã. Cảm giác được hòa mình vào thiên nhiên thật tuyệt vời!</p>
<blockquote>
<p>"Thiên nhiên là nơi ta tìm thấy sự bình yên cho tâm hồn"</p>
</blockquote>
<p><strong>Điểm nổi bật trong chuyến đi:</strong></p>
<ol>
<li><strong>Bãi Sao</strong> - Bãi biển đẹp nhất với cát trắng mịn màng và nước trong xanh</li>
<li><strong>Dinh Cậu</strong> - Ngôi đền nhỏ xinh bên bờ biển, nơi ngư dân cầu nguyện bình an</li>
<li><strong>Chợ đêm Phú Quốc</strong> - Thiên đường ẩm thực hải sản tươi ngon</li>
<li><strong>Vườn tiêu</strong> - Tìm hiểu quy trình trồng và chế biến hạt tiêu</li>
</ol>
<p>Ngoài ra, tôi còn được thử <em>lặn ngắm san hô</em> ở Nam Đảo, cảnh biển dưới nước đẹp như tranh vẽ với những rạn san hô đầy màu sắc và đàn cá nhiệt đới bơi lội tung tăng. Thật sự là một trải nghiệm khó quên! �🪸</p>`,
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
      <div className="flex-1 bg-gray-50 min-h-screen py-4 sm:py-6">
        <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 lg:px-0">
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
          <div className="space-y-4 sm:space-y-6">
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