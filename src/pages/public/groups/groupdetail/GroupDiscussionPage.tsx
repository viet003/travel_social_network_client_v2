import React, { useEffect, useState, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useParams, useOutletContext } from "react-router-dom";
import { PostCreateModal, PostModal } from "../../../../components/modal/post";
import { apiGetPostsByGroup } from "../../../../services/postService";
import type { PostResponse } from "../../../../types/post.types";
import type { GroupResponse } from "../../../../services/groupService";
import { toast } from "react-toastify";
import { formatTimeAgo } from "../../../../utilities/helper";

interface OutletContext {
  groupData: GroupResponse | null;
  isMember: boolean;
}

const GroupDiscussionPage: React.FC = () => {
  const { groupData, isMember } = useOutletContext<OutletContext>();
  const { groupId } = useParams<{ groupId: string }>();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortFilter, setSortFilter] = useState<string>("relevant");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filterOptions = [
    {
      value: "relevant",
      label: "Phù hợp nhất",
      description: "Hiển thị bài viết phù hợp nhất trước tiên. Nếu không có, các bài viết sẽ được sắp xếp theo hoạt động gần đây.",
      icon: "fluent:star-24-regular",
    },
    {
      value: "new_activity",
      label: "Hoạt động mới đây",
      description: "Hiển thị bài viết có bình luận gần đây trước tiên",
      icon: "fluent:comment-multiple-24-regular",
    },
    {
      value: "new_post",
      label: "Bài viết mới",
      description: "Hiển thị bài viết được tạo gần đây nhất trước tiên",
      icon: "fluent:document-add-24-regular",
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch group posts
  const fetchGroupPosts = async (pageNum: number = 0) => {
    if (loading || !groupId || !hasMore || !isMember) return; // Prevent duplicate requests and stop if no more data

    try {
      setLoading(true);
      console.log(`Fetching group posts page ${pageNum} with filter: ${sortFilter}...`);
      
      // Pass sort parameter to API
      const response = await apiGetPostsByGroup(groupId, pageNum, 5, sortFilter);

      if (response.success && response.data) {
        console.log(
          `Loaded ${response.data.content.length} posts for page ${pageNum}`
        );

        if (pageNum === 0) {
          // Initial load or refresh
          setPosts(response.data.content);
        } else {
          // Append new posts, filter out duplicates
          setPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.postId));
            const newPosts = response.data.content.filter(
              (p) => !existingIds.has(p.postId)
            );
            return [...prev, ...newPosts];
          });
        }

        // Check if there are more posts to load based on response
        setHasMore(!response.data.last && response.data.content.length === 5);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching group posts:", error);
      toast.error("Không thể tải bài viết");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (groupId) {
      setPosts([]);
      setPage(0);
      setHasMore(true);
      fetchGroupPosts(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, sortFilter]); // Reload when sort filter changes

  // Load more posts when page changes
  useEffect(() => {
    if (page > 0) {
      fetchGroupPosts(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Callback ref for infinite scroll
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            console.log("Reached end of posts, loading more...");
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          rootMargin: "200px", // Load before reaching the bottom
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handlePostCreated = (success: boolean, newPost?: PostResponse) => {
    if (success && newPost) {
      console.log(
        "Post created successfully in group! Adding to top of feed...",
        newPost
      );
      // Add new post to the beginning of the array
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const handleFilterChange = (value: string) => {
    setSortFilter(value);
    setShowFilterDropdown(false);
  };

  const currentFilter = filterOptions.find(opt => opt.value === sortFilter) || filterOptions[0];

  return (
    <div className="space-y-4">
      {!isMember ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Icon
            icon="fluent:lock-closed-24-regular"
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vui lòng tham gia nhóm
          </h3>
          <p className="text-gray-500">
            Bạn cần tham gia nhóm để xem các bài viết thảo luận
          </p>
        </div>
      ) : (
        <>
      {/* Sidebar với Giới thiệu nhóm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content - Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create Post Modal */}
          {groupData && (
            <PostCreateModal
              setCreateSuccess={handlePostCreated}
              groupId={groupId}
            />
          )}

          {/* Filter */}
          <div className="bg-white rounded-lg shadow-sm p-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded px-2 py-1 transition-colors cursor-pointer"
            >
              <Icon
                icon="fluent:options-24-regular"
                className="h-4 w-4 text-gray-600"
              />
              <span className="text-sm font-medium text-gray-700">
                {currentFilter.label}
              </span>
              <Icon
                icon="fluent:chevron-down-24-filled"
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  showFilterDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showFilterDropdown && (
              <div className="absolute top-full left-0 w-96 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      sortFilter === option.value ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Icon
                          icon={option.icon}
                          className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm mb-1">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-600">
                            {option.description}
                          </div>
                        </div>
                      </div>
                      {sortFilter === option.value && (
                        <Icon
                          icon="fluent:checkmark-24-filled"
                          className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post, index) => {
              if (!post.user) return null;

              return (
                <div
                  key={post.postId}
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                >
                  <PostModal
                    postId={post.postId}
                    userId={post.user.userId}
                    avatar={post.user.avatarImg || undefined}
                    userName={post.user.fullName}
                    timeAgo={formatTimeAgo(post.createdAt)}
                    content={post.content}
                    mediaList={post.mediaList?.map((media) => ({
                      type: media.type,
                      url: media.url,
                    }))}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    shareCount={post.shareCount}
                    tags={post.tags}
                    isShare={post.isShare}
                    sharedPost={post.sharedPost || undefined}
                    privacy={post.privacy}
                    group={
                      post.group
                        ? {
                            ...post.group,
                            coverImageUrl:
                              post.group.coverImageUrl || undefined,
                          }
                        : undefined
                    }
                    postType={post.postType}
                    liked={post.liked}
                    location={post.location || undefined}
                  />
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-center py-8">
                <Icon
                  icon="fluent:spinner-ios-20-filled"
                  className="w-8 h-8 text-blue-600 animate-spin"
                />
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Icon
                  icon="fluent:document-24-regular"
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Hãy là người đầu tiên chia sẻ điều gì đó trong nhóm này!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Giới thiệu */}
        {groupData && (
          <div className="hidden lg:block space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Giới thiệu
              </h3>
              <p className="text-base text-gray-700 mb-6">
                {groupData.groupDescription || "Ae vào nhóm vui vẻ hòa đồng !"}
              </p>

              <div className="space-y-5">
                {/* Privacy Status */}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon
                      icon={
                        !groupData.privacy
                          ? "fluent:globe-24-regular"
                          : "fluent:lock-closed-24-regular"
                      }
                      className="h-6 w-6 text-gray-600"
                    />
                    <span className="text-gray-900 font-semibold text-base">
                      {!groupData.privacy ? "Công khai" : "Riêng tư"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-9">
                    {!groupData.privacy 
                      ? "Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng."
                      : "Chỉ thành viên mới có thể xem bài viết trong nhóm này."}
                  </p>
                </div>

                {/* Visible Status */}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon
                      icon="fluent:eye-24-regular"
                      className="h-6 w-6 text-gray-600"
                    />
                    <span className="text-gray-900 font-semibold text-base">
                      Hiển thị
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-9">
                    Ai cũng có thể tìm thấy nhóm này.
                  </p>
                </div>

                {/* Location */}
                {groupData.location && (
                  <div>
                    <div className="flex items-center space-x-3">
                      <Icon
                        icon="fluent:location-24-regular"
                        className="h-6 w-6 text-gray-600"
                      />
                      <span className="text-gray-900 font-semibold text-base">
                        {groupData.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default GroupDiscussionPage;
