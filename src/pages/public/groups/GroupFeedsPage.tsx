import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { PostModal } from '../../../components/modal/post';
import { apiGetMyGroups } from '../../../services/groupService';
import { apiGetPostsByGroup } from '../../../services/postService';
import type { PostResponse } from '../../../types/post.types';
import { toast } from 'react-toastify';

const GroupFeedsPage: React.FC = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchGroupPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGroupPosts = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      // Lấy danh sách các nhóm đã tham gia
      const groupsResponse = await apiGetMyGroups(0, 20);
      const myGroups = groupsResponse.data.content;

      if (myGroups.length === 0) {
        setHasMore(false);
        return;
      }

      // Lấy posts từ tất cả các groups (lấy 5 posts mỗi lần)
      const postPromises = myGroups.map(group => 
        apiGetPostsByGroup(group.groupId, currentPage, 5)
          .catch(err => {
            console.error(`Error fetching posts for group ${group.groupId}:`, err);
            return null;
          })
      );

      const postsResponses = await Promise.all(postPromises);
      
      // Gộp tất cả posts lại và lọc null values
      const allPosts = postsResponses
        .filter(response => response !== null)
        .flatMap(response => response!.data.content);

      if (allPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...allPosts]);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching group posts:', error);
      toast.error('Không thể tải bài viết từ nhóm');
    } finally {
      setIsLoading(false);
    }
  };

  // Callback ref for infinite scroll
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            console.log('Reached end of posts, loading more...');
            fetchGroupPosts();
          }
        },
        {
          rootMargin: '200px', // Load before reaching the bottom
        }
      );

      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, hasMore]
  );

  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleImageClick = (img: string, index: number) => {
    console.log('Image clicked:', img, index);
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icon icon="fluent:spinner-ios-20-filled" className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

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
          {posts.map((post, index) => (
            <div
              key={post.postId}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              <PostModal
                postId={post.postId}
                userId={post.user?.userId || ''}
                avatar={post.user?.avatarImg || 'https://via.placeholder.com/150'}
                userName={post.user?.fullName || 'Unknown User'}
                location={post.location || ''}
                timeAgo={post.createdAt}
                content={post.content}
                mediaList={post.mediaList || []}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                shareCount={post.shareCount}
                tags={post.tags || []}
                privacy={post.privacy}
                postType={post.postType || 'NORMAL'}
                group={post.group ? {
                  groupId: post.group.groupId,
                  groupName: post.group.groupName,
                  coverImageUrl: post.group.coverImageUrl || ''
                } : undefined}
                onShare={handleShare}
                onImageClick={handleImageClick}
                liked={post.liked}
              />
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && posts.length > 0 && (
            <div className="flex justify-center py-8">
              <Icon icon="fluent:spinner-ios-20-filled" className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Empty State - hiển thị khi không có bài viết */}
        {posts.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg mt-[200px] text-center">
            <Icon icon="mdi:inbox" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-600">Các nhóm bạn tham gia chưa có bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupFeedsPage;