import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  
  // Intersection Observer ref
  const observer = useRef<IntersectionObserver | null>(null);

  // Function to hide a post
  const handleHidePost = (postId: string) => {
    setHiddenPostIds(prev => new Set([...prev, postId]));
  };

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate(path.LANDING);
  };

  // Fetch news feed from API
  const fetchNewsFeed = async (pageNum: number = 0) => {
    if (loading) return; // Prevent duplicate requests
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching news feed page ${pageNum}...`);
      
      const response = await apiGetNewsFeed(pageNum, 10);
      
      if (response.success && response.data) {
        console.log(`Loaded ${response.data.length} posts for page ${pageNum}`);
        
        if (pageNum === 0) {
          // Initial load
          setPosts(response.data);
        } else {
          // Append new posts, filter out duplicates
          setPosts(prev => {
            const existingIds = new Set(prev.map(p => p.postId));
            const newPosts = response.data.filter(p => !existingIds.has(p.postId));
            return [...prev, ...newPosts];
          });
        }
        
        // Check if there are more posts to load
        setHasMore(response.data.length === 10);
        // setHasMore(true); // Tạm thời luôn true để test
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching news feed:', err);
      setError('Không thể tải bảng tin. Vui lòng thử lại.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Callback ref for the last post element (Intersection Observer)
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            console.log('Reached end of feed, loading more...');
            setPage((prevPage) => prevPage + 1);
          }
        },
        { 
          rootMargin: '200px' // Load before reaching the bottom
        }
      );
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Load initial news feed
  useEffect(() => {
    fetchNewsFeed(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load more posts when page changes
  useEffect(() => {
    if (page > 0) {
      fetchNewsFeed(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Reload feed after creating a post
  const handlePostCreated = (success: boolean, newPost?: PostResponse) => {
    if (success && newPost) {
      console.log('Post created successfully! Adding to top of feed...', newPost);
      // Add new post to the beginning of the array
      setPosts(prev => [newPost, ...prev]);
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
            setCreateSuccess={handlePostCreated}
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
                {posts.filter(post => !hiddenPostIds.has(post.postId)).map((post, index) => {
                  // Attach ref to the last post for infinite scroll
                  if (posts.length === index + 1) {
                    return (
                      <div key={post.postId} ref={lastPostElementRef}>
                        <PostModal
                          postId={post.postId}
                          userId={post.user?.userId || ''}
                          avatar={post.user?.avatarImg || ''}
                          userName={post.user?.fullName || 'Người dùng'}
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
                          isShare={post.isShare}
                          sharedPost={post.sharedPost}
                        privacy={post.privacy}
                        postType={post.postType}
                        group={post.group ? {
                          groupId: post.group.groupId,
                          groupName: post.group.groupName,
                          coverImageUrl: post.group.coverImageUrl || undefined
                        } : null}
                        onImageClick={() => {}}
                        onShare={() => {}}
                        liked={post.liked}
                        onHidePost={() => handleHidePost(post.postId)}
                      />
                    </div>
                  );
                }
                
                return (
                  <PostModal
                      key={post.postId}
                      postId={post.postId}
                      userId={post.user?.userId || ''}
                      avatar={post.user?.avatarImg || ''}
                      userName={post.user?.fullName || 'Người dùng'}
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
                      isShare={post.isShare}
                      sharedPost={post.sharedPost}
                      privacy={post.privacy}
                      postType={post.postType}
                      group={post.group ? {
                        groupId: post.group.groupId,
                        groupName: post.group.groupName,
                        coverImageUrl: post.group.coverImageUrl || undefined
                        } : null}
                      onImageClick={() => {}}
                      onShare={() => {}}
                      liked={post.liked}
                      onHidePost={() => handleHidePost(post.postId)}
                    />
                  );
                })}                {/* Loading indicator when fetching more */}
                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
                
                {/* End of feed message */}
                {!hasMore && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Bạn đã xem hết bài viết</p>
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