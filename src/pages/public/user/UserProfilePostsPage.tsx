import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Image, Skeleton, message } from "antd";
import { PostModal, PostCreateModal } from "../../../components/modal/post";
import avatardf from "../../../assets/images/avatar_default.png";
import { path } from "../../../utilities/path";
import { apiGetPostsByUser } from "../../../services/postService";
import { apiGetMyFriends } from "../../../services/friendshipService";
import { apiGetUserPhotos } from "../../../services/photoService";
import type { PostResponse, PageableResponse } from "../../../types/post.types";
import type { UserResponse } from "../../../types/user.types";
import type { UserPhotoResponse } from "../../../services/photoService";

// Types
interface Post {
  postId: string;
  userId: string;
  fullName: string;
  avatarImg?: string;
  location?: string;
  createdAt: string;
  content: string;
  mediaList?: Array<{
    type: "IMAGE" | "VIDEO";
    url: string;
  }>;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  tags?: string[];
  isShare?: boolean;
  sharedPost?: PostResponse | null;
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
  onPostsLoaded,
}) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { onOpenEditProfile } = useOutletContext<OutletContext>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [postCreated, setPostCreated] = useState<boolean>(false);
  const [userPhotos, setUserPhotos] = useState<UserPhotoResponse[]>([]);
  const [friends, setFriends] = useState<UserResponse[]>([]);
  const [totalFriends, setTotalFriends] = useState<number>(0);
  const observer = useRef<IntersectionObserver | null>(null);

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    const basePath = `/home/user/${userId}`;
    switch (tabId) {
      case "photos":
        navigate(`${basePath}/${path.USER_PHOTOS}`);
        break;
      case "friends":
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
        { rootMargin: "100px" }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch initial data with Promise.all
  const fetchInitialData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Gọi song song các API: Posts, Friends, Photos
      const [postsResponse, friendsResponse, photosResponse] = await Promise.all([
        apiGetPostsByUser(userId, 0, 5),
        apiGetMyFriends().catch(() => ({ data: [] })), // Catch error if not authorized
        apiGetUserPhotos(userId).catch(() => ({ data: { data: { avatars: [], coverImages: [], postPhotos: [] } } })),
      ]);

      // Process posts
      if (postsResponse.data) {
        const postsData = postsResponse.data as PageableResponse<PostResponse>;
        const mappedPosts: Post[] = postsData.content.map(
          (post: PostResponse) => ({
            postId: post.postId,
            userId: post.user?.userId || '',
            fullName: post.user?.fullName || "Người dùng",
            avatarImg: post.user?.avatarImg || undefined,
            location: post.location || undefined,
            createdAt: post.createdAt,
            content: post.content,
            mediaList: post.mediaList.map((media) => ({
              type: media.type,
              url: media.url,
            })),
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            shareCount: post.shareCount,
            tags: post.tags || [],
            isShare: post.isShare || false,
            sharedPost: post.sharedPost || null,
            privacy: post.privacy,
            liked: post.isLiked,
          })
        );

        setPosts(mappedPosts);
        setHasMore(postsData.content.length > 0 && !postsData.last);
        onPostsLoaded?.(postsData.totalElements);
      }

      // Process friends
      if (friendsResponse.data && Array.isArray(friendsResponse.data)) {
        const friendsList = friendsResponse.data as UserResponse[];
        setFriends(friendsList.slice(0, 9)); // Only show first 9 friends
        setTotalFriends(friendsList.length);
      }

      // Process photos
      if (photosResponse.data?.data) {
        const photosData = photosResponse.data.data;
        const allPhotos: UserPhotoResponse[] = [];
        
        // Combine all photos: avatars, coverImages, postPhotos
        if (photosData.avatars) allPhotos.push(...photosData.avatars);
        if (photosData.coverImages) allPhotos.push(...photosData.coverImages);
        if (photosData.postPhotos) allPhotos.push(...photosData.postPhotos);
        
        // Sort by createdAt and take first 9
        allPhotos.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        setUserPhotos(allPhotos.slice(0, 9));
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      message.error("Không thể tải dữ liệu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [userId, onPostsLoaded]);

  // Fetch user posts with pagination (for infinite scroll)
  const fetchUserPosts = useCallback(
    async (pageNum: number) => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await apiGetPostsByUser(userId, pageNum, 5);

        if (response.data) {
          const postsData = response.data as PageableResponse<PostResponse>;
          const mappedPosts: Post[] = postsData.content.map(
            (post: PostResponse) => ({
              postId: post.postId,
              userId: post.user?.userId || '',
              fullName: post.user?.fullName || "Người dùng",
              avatarImg: post.user?.avatarImg || undefined,
              location: post.location || undefined,
              createdAt: post.createdAt,
              content: post.content,
              mediaList: post.mediaList.map((media) => ({
                type: media.type,
                url: media.url,
              })),
              likeCount: post.likeCount,
              commentCount: post.commentCount,
              shareCount: post.shareCount,
              tags: post.tags || [],
              isShare: post.isShare || false,
              sharedPost: post.sharedPost || null,
              privacy: post.privacy,
              liked: post.isLiked,
            })
          );

          if (pageNum === 0) {
            setPosts(mappedPosts);
            onPostsLoaded?.(postsData.totalElements);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...mappedPosts]);
          }
          setHasMore(mappedPosts.length > 0 && !postsData.last);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        message.error("Không thể tải bài viết. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    },
    [userId, onPostsLoaded]
  );

  // Load initial data when component mounts or userId changes
  useEffect(() => {
    if (!userId) return;
    setPage(0);
    setHasMore(true);
    fetchInitialData();
  }, [userId, fetchInitialData]);

  // Load more posts when page changes (for infinite scroll)
  useEffect(() => {
    if (!userId || page === 0) return; // Skip page 0 as it's handled by fetchInitialData
    if (!hasMore) return;
    fetchUserPosts(page);
  }, [page, userId, hasMore, fetchUserPosts]);

  // Reload posts after creating new post
  useEffect(() => {
    if (createSuccess) {
      setPage(0);
      setHasMore(true);
      fetchInitialData();
    }
  }, [createSuccess, fetchInitialData]);

  // Reload posts when postCreated changes
  useEffect(() => {
    if (postCreated) {
      setPage(0);
      setHasMore(true);
      fetchInitialData();
      setPostCreated(false);
    }
  }, [postCreated, fetchInitialData]);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6">
      {/* Left Sidebar - Hidden on mobile and tablet, shown only on desktop */}
      <div className="hidden lg:block lg:w-[360px] overflow-y-auto flex-shrink-0 space-y-4 lg:sticky lg:top-0 lg:self-start lg:max-h-screen">
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
              onClick={() => handleTabClick("photos")}
            >
              Xem tất cả ảnh
            </button>
          </div>
          <Image.PreviewGroup>
            <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-2">
              {userPhotos.length > 0 ? (
                userPhotos.map((photo) => (
                  <div
                    key={photo.photoId}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={photo.url}
                      alt="Photo"
                      className="cursor-pointer"
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        display: "block",
                        minHeight: "100%",
                        minWidth: "100%",
                      }}
                      placeholder={
                        <Skeleton.Image
                          active
                          style={{ width: "100%", height: "100%" }}
                        />
                      }
                      preview={{
                        mask: (
                          <div className="flex items-center justify-center">
                            Xem
                          </div>
                        ),
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center">
                  <Icon
                    icon="lucide:image"
                    width={48}
                    className="mx-auto mb-3 text-gray-300"
                  />
                  <p className="text-sm text-gray-400">Chưa có ảnh</p>
                </div>
              )}
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
              onClick={() => handleTabClick("friends")}
            >
              Xem tất cả bạn bè
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-2">
            {friends.length > 0 ? (
              friends.map((friend, i) => (
                <div key={friend.userId || i} className="text-center">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer mb-1">
                    <Image
                      src={friend.avatarImg || avatardf}
                      alt={
                        friend.userProfile?.fullName ||
                        friend.userName ||
                        `Friend ${i + 1}`
                      }
                      className="cursor-pointer"
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        display: "block",
                        minHeight: "100%",
                        minWidth: "100%",
                      }}
                      preview={false}
                      placeholder={
                        <Skeleton.Image
                          active
                          style={{ width: "100%", height: "100%" }}
                        />
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-700 font-medium truncate">
                    {friend.userProfile?.fullName ||
                      friend.userName ||
                      `Bạn ${i + 1}`}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center">
                <Icon
                  icon="lucide:users"
                  width={48}
                  className="mx-auto mb-3 text-gray-300"
                />
                <p className="text-sm text-gray-400">Chưa có bạn bè</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Content Area - Posts */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Post Create Modal */}
        <PostCreateModal setCreateSuccess={setPostCreated} />

        {loading && page === 0 && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        )}

        {posts.length === 0 && !loading ? (
          <div className="py-12 text-center">
            <Icon
              icon="lucide:camera"
              width={48}
              className="mx-auto mb-4 text-gray-400"
            />
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
                    userName={post.fullName}
                    location={post.location}
                    timeAgo={post.createdAt}
                    content={post.content}
                    mediaList={post.mediaList || []}
                    likeCount={post.likeCount || 0}
                    commentCount={post.commentCount || 0}
                    shareCount={post.shareCount || 0}
                    tags={post.tags || []}
                    isShare={post.isShare}
                    sharedPost={post.sharedPost}
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
                userName={post.fullName}
                location={post.location}
                timeAgo={post.createdAt}
                content={post.content}
                mediaList={post.mediaList || []}
                likeCount={post.likeCount || 0}
                commentCount={post.commentCount || 0}
                shareCount={post.shareCount || 0}
                tags={post.tags || []}
                isShare={post.isShare}
                sharedPost={post.sharedPost}
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
            <Icon
              icon="eos-icons:loading"
              width={32}
              className="text-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePostsPage;
