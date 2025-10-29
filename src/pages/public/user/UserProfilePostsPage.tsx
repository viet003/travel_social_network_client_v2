import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Icon } from '@iconify/react';
import { Image, Skeleton } from 'antd';
import { PostModal, PostCreateModal } from '../../../components/modal/post';
import avatardf from '../../../assets/images/avatar_default.png';
import { path } from '../../../utilities/path';

// Types
interface Post {
  postId: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarImg?: string;
  location?: string;
  createdAt: string;
  content: string;
  mediaList?: Array<{
    type: 'IMAGE' | 'VIDEO';
    url: string;
  }>;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  tags?: string[];
  isShare?: boolean;
  privacy?: string;
  liked?: boolean;
}

interface UserProfilePostsPageProps {
  createSuccess?: boolean;
  onPostsLoaded?: (totalElements: number) => void;
}

interface OutletContext {
  createSuccess: boolean;
  onPostsLoaded: (totalElements: number) => void;
  onOpenEditProfile: () => void;
}

const UserProfilePostsPage: React.FC<UserProfilePostsPageProps> = ({ 
  createSuccess = false,
  onPostsLoaded
}) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { onOpenEditProfile } = useOutletContext<OutletContext>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [postCreated, setPostCreated] = useState<boolean>(false);
  const [totalPhotos, setTotalPhotos] = useState<number>(12);
  const [totalFriends, setTotalFriends] = useState<number>(128);
  const observer = useRef<IntersectionObserver | null>(null);

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    const basePath = `/home/user/${userId}`;
    switch (tabId) {
      case 'photos':
        navigate(`${basePath}/${path.USER_PHOTOS}`);
        break;
      case 'friends':
        navigate(`${basePath}/${path.USER_FRIENDS}`);
        break;
      default:
        break;
    }
  };

  // Callback to observe the last post element
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { rootMargin: '100px' }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch user posts with pagination
  const fetchUserPosts = async (pageNum: number) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockPosts: Post[] = Array.from({ length: 5 }, (_, i) => ({
        postId: `post-${pageNum}-${i}`,
        userId: userId || "",
        firstName: "Nguyễn Văn",
        lastName: "An",
        avatarImg: "",
        location: "Hà Nội, Việt Nam",
        createdAt: new Date().toISOString(),
        content: `Đây là nội dung bài viết mẫu ${pageNum}-${i}. Khám phá những địa điểm tuyệt vời trên khắp thế giới! 🌍`,
        mediaList: [
          {
            type: 'IMAGE' as const,
            url: "/placeholder.svg?height=400&width=600",
          },
        ],
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
        shareCount: Math.floor(Math.random() * 20),
        tags: ["travel", "adventure"],
        isShare: false,
        privacy: "PUBLIC",
        liked: false,
      }));

      if (pageNum === 0) {
        setPosts(mockPosts);
        const total = 25; // Mock total
        setTotalElements(total);
        onPostsLoaded?.(total);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...mockPosts]);
      }
      setHasMore(mockPosts.length > 0);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load posts when page or userId changes
  useEffect(() => {
    if (!userId || !hasMore) return;
    fetchUserPosts(page);
  }, [userId, page]);

  // Reset page when userId changes
  useEffect(() => {
    setPage(0);
    setHasMore(true);
  }, [userId]);

  // Reload posts after creating new post
  useEffect(() => {
    if (createSuccess) {
      fetchUserPosts(0);
      setPage(0);
      setHasMore(true);
    }
  }, [createSuccess]);

  // Reload posts when postCreated changes
  useEffect(() => {
    if (postCreated) {
      fetchUserPosts(0);
      setPage(0);
      setHasMore(true);
      setPostCreated(false);
    }
  }, [postCreated]);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6">
      {/* Left Sidebar - Hidden on mobile and tablet, shown only on desktop */}
      <div className="hidden lg:block lg:w-[360px] flex-shrink-0 space-y-4 lg:sticky lg:top-0 lg:self-start">
        {/* Giới thiệu (Introduction) */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-xl font-bold mb-4">Giới thiệu</h3>
          <div className="space-y-3">
            <button 
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition cursor-pointer"
              onClick={onOpenEditProfile}
            >
              Thêm tiểu sử
            </button>
            <button 
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition cursor-pointer"
              onClick={onOpenEditProfile}
            >
              Chỉnh sửa chi tiết
            </button>
            <button 
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition cursor-pointer"
              onClick={onOpenEditProfile}
            >
              Thêm nội dung đáng chú ý
            </button>
          </div>
        </div>

        {/* Ảnh (Photos) */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Ảnh</h3>
            <button 
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              onClick={() => handleTabClick('photos')}
            >
              Xem tất cả ảnh
            </button>
          </div>
          <Image.PreviewGroup>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <Image 
                    src={`https://picsum.photos/120/120?random=${i}`}
                    alt={`Photo ${i}`}
                    className="w-full h-full object-cover cursor-pointer"
                    style={{ objectFit: 'cover' }}
                    placeholder={
                      <Skeleton.Image 
                        active 
                        style={{ width: '100%', height: '100%' }}
                      />
                    }
                    preview={{
                      mask: <div className="flex items-center justify-center">Xem</div>
                    }}
                  />
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </div>

        {/* Bạn bè (Friends) */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Bạn bè</h3>
              <p className="text-sm text-gray-500">{totalFriends} người bạn</p>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              onClick={() => handleTabClick('friends')}
            >
              Xem tất cả bạn bè
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="text-center">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer mb-1">
                  <Image 
                    src={avatardf} 
                    alt={`Friend ${i}`}
                    className="w-full h-full object-cover"
                    preview={false}
                    placeholder={
                      <Skeleton.Avatar 
                        active 
                        size={100}
                        shape="square"
                      />
                    }
                  />
                </div>
                <p className="text-xs text-gray-700 font-medium truncate">Bạn {i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content Area - Posts */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Post Create Modal */}
        <PostCreateModal 
          setCreateSuccess={setPostCreated}
        />

        {loading && page === 0 && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        )}

        {posts.length === 0 && !loading ? (
          <div className="py-12 text-center">
            <Icon icon="lucide:camera" width={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Chưa có bài viết nào</p>
          </div>
        ) : (
        posts.map((post, index) => {
          // Attach ref to the last post for infinite scroll
          if (posts.length === index + 1) {
            return (
              <div key={post.postId} ref={lastPostElementRef}>
                <PostModal
                  postId={post.postId}
                  userId={post.userId}
                  avatar={post.avatarImg || avatardf}
                  userName={`${post.firstName || ''} ${post.lastName || ''}`.trim() || 'Người dùng'}
                  location={post.location}
                  timeAgo={post.createdAt}
                  content={post.content}
                  mediaList={post.mediaList || []}
                  likeCount={post.likeCount || 0}
                  commentCount={post.commentCount || 0}
                  shareCount={post.shareCount || 0}
                  tags={post.tags || []}
                  isShare={post.isShare}
                  privacy={post.privacy}
                  comments={[]}
                  liked={post.liked}
                />
              </div>
            );
          }
          return (
            <PostModal
              key={post.postId}
              postId={post.postId}
              userId={post.userId}
              avatar={post.avatarImg || avatardf}
              userName={`${post.firstName || ''} ${post.lastName || ''}`.trim() || 'Người dùng'}
              location={post.location}
              timeAgo={post.createdAt}
              content={post.content}
              mediaList={post.mediaList || []}
              likeCount={post.likeCount || 0}
              commentCount={post.commentCount || 0}
              shareCount={post.shareCount || 0}
              tags={post.tags || []}
              isShare={post.isShare}
              privacy={post.privacy}
              comments={[]}
              liked={post.liked}
            />
          );
        })
      )}

      {/* Show spinner when loading more posts (not first page) */}
      {loading && page > 0 && (
        <div className="flex items-center justify-center w-full py-8">
          <Icon icon="eos-icons:loading" width={32} className="text-blue-500" />
        </div>
      )}
      </div>
    </div>
  );
};

export default UserProfilePostsPage;
