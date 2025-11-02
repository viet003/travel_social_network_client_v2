import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LeftSidebar, RightSidebar } from '../../components/common';
import { PostCreateModal, PostModal } from '../../components/modal/post';
import { authAction } from '../../stores/actions';
import { path } from '../../utilities/path';
import { apiGetNewsFeed } from '../../services/suggestionService';
import type { PostResponse } from '../../types/post.types';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate(path.LANDING);
  };

  // Fetch news feed from API
  const fetchNewsFeed = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetNewsFeed(pageNum, 20);
      
      if (response.success && response.data) {
        if (pageNum === 1) {
          setPosts(response.data);
        } else {
          setPosts(prev => [...prev, ...response.data]);
        }
        
        // Check if there are more posts to load
        setHasMore(response.data.length === 20);
      }
    } catch (err) {
      console.error('Error fetching news feed:', err);
      setError('Không thể tải bảng tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Load initial news feed
  useEffect(() => {
    fetchNewsFeed(1);
  }, []);

  // Load more posts
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNewsFeed(nextPage);
    }
  };

  return (
    <div className="flex">
      {/* Left Sidebar - Hidden on mobile and tablet */}
      <div className="hidden lg:block">
        <LeftSidebar onLogout={handleLogout} />
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
                // Reload news feed after creating a post
                fetchNewsFeed(1);
                setPage(1);
              }
            }}
          />

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>{error}</p>
              <button 
                onClick={() => fetchNewsFeed(1)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-4 sm:space-y-6">
            {posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <PostModal
                    key={post.postId}
                    postId={post.postId}
                    userId={post.userId}
                    avatar={post.avatarImg || ''}
                    userName={post.fullName}
                    location={post.location || ''}
                    timeAgo={post.createdAt}
                    content={post.content}
                    mediaList={post.mediaList.map(media => ({
                      id: media.mediaId,
                      url: media.url,
                      type: media.type
                    }))}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    shareCount={post.shareCount}
                    tags={post.tags}
                    privacy={post.privacy}
                    group={post.group ? {
                      groupId: post.group.groupId,
                      groupName: post.group.groupName,
                      coverImageUrl: post.group.coverImageUrl || undefined
                    } : null}
                    comments={[]}
                    onImageClick={() => {}}
                    onShare={() => {}}
                    onComment={() => {}}
                    liked={post.isLiked}
                  />
                ))}
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center py-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang tải...' : 'Tải thêm'}
                    </button>
                  </div>
                )}
              </>
            ) : loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Không có bài viết nào để hiển thị</p>
              </div>
            )}
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