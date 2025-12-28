import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  apiGetGroupMembers, 
  apiGetGroupById, 
  apiChangeMemberRole,
  apiApproveJoinRequest,
  apiRejectJoinRequest,
} from '../../../../services/groupService';
import { toast } from 'react-toastify';
import avatardf from '../../../../assets/images/avatar_default.png';
import { TravelButton } from '../../../../components/ui/customize';
import type { GroupMemberResponse, GroupResponse } from '../../../../types/group.types';
interface AuthState {
  userId: string | null;
  userName: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  isLoggedIn: boolean;
}

interface OutletContext {
  groupData: GroupResponse | null;
  isMember: boolean;
  currentUserRole: string | null;
}

const GroupMembersPage: React.FC = () => {
  const { isMember, currentUserRole } = useOutletContext<OutletContext>();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const currentUserId = useSelector((state: { auth: AuthState }) => state.auth.userId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [members, setMembers] = useState<GroupMemberResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch group info to get current user's role
  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupId) return;
      try {
        const response = await apiGetGroupById(groupId);
        if (response.data) {
          // currentUserRole is already available from context
        }
      } catch (error) {
        console.error('Error fetching group info:', error);
      }
    };
    fetchGroupInfo();
  }, [groupId]);

  // Fetch members from API
  const fetchMembers = async (pageNum: number = 0, append: boolean = false) => {
    if (!groupId || loading || (!isMember && currentUserRole !== 'ADMIN')) return;

    setLoading(true);
    try {
      const response = await apiGetGroupMembers(groupId, searchQuery, filterTab, pageNum, 5);
      
      if (response.data) {
        const newMembers = response.data.content;
        
        if (append) {
          setMembers(prev => [...prev, ...newMembers]);
        } else {
          setMembers(newMembers);
        }
        
        setTotalElements(response.data.totalElements);
        setHasMore(newMembers.length === 5); // Has more if we got a full page
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
      toast.error('Không thể tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount, filter changes, and search (with debounce for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchMembers(0, false);
    }, searchQuery ? 500 : 0); // Debounce only for search, immediate for other changes

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, filterTab, searchQuery]);

  // Callback ref for infinite scroll
  const lastMemberElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMembers(nextPage, true);
          }
        },
        {
          rootMargin: '200px',
        }
      );

      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, hasMore, page]
  );

  // Check if current user is admin/moderator/owner
  const canManageMembers = currentUserRole && ['OWNER', 'ADMIN', 'MODERATOR'].includes(currentUserRole);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: totalElements },
    { id: 'admins', label: 'Quản trị viên', count: members.filter(m => m.role !== 'MEMBER').length },
    ...(canManageMembers ? [{ id: 'pending', label: 'Yêu cầu tham gia', count: members.filter(m => m.status === 'PENDING').length }] : []),
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER':
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      case 'MODERATOR':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Chủ nhóm';
      case 'ADMIN':
        return 'Quản trị viên';
      case 'MODERATOR':
        return 'Người kiểm duyệt';
      default:
        return 'Thành viên';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Check if user can change role (OWNER can change anyone except themselves, ADMIN can change MEMBER and MODERATOR except themselves)
  const canChangeRole = (targetUserId: string, targetRole: string) => {
    // Cannot change own role
    if (targetUserId === currentUserId) return false;
    
    if (currentUserRole === 'OWNER') return true;
    if (currentUserRole === 'ADMIN' && targetRole !== 'OWNER' && targetRole !== 'ADMIN') return true;
    return false;
  };

  // Get available role options for a member
  const getAvailableRoles = (currentRole: string) => {
    const roles = [];
    
    if (currentUserRole === 'OWNER') {
      // Owner can set any role
      if (currentRole !== 'ADMIN') roles.push({ value: 'ADMIN', label: 'Thăng quản trị viên' });
      if (currentRole !== 'MODERATOR') roles.push({ value: 'MODERATOR', label: 'Thăng người kiểm duyệt' });
      if (currentRole !== 'MEMBER') roles.push({ value: 'MEMBER', label: 'Giáng thành viên' });
    } else if (currentUserRole === 'ADMIN') {
      // Admin can only manage MEMBER and MODERATOR
      if (currentRole === 'MEMBER') {
        roles.push({ value: 'MODERATOR', label: 'Thăng người kiểm duyệt' });
      } else if (currentRole === 'MODERATOR') {
        roles.push({ value: 'MEMBER', label: 'Giáng thành viên' });
      }
    }
    
    return roles;
  };

  // Handle role change
  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!groupId) return;
    
    try {
      await apiChangeMemberRole(groupId, memberId, newRole);
      
      // Refresh members list
      setPage(0);
      fetchMembers(0, false);
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Error changing member role:', error);
      toast.error('Không thể cập nhật vai trò');
    }
  };

  // Handle approve join request
  const handleApproveRequest = async (memberId: string) => {
    if (!groupId) return;
    
    try {
      const response = await apiApproveJoinRequest(groupId, memberId);
      
      // Update member with the response data from server
      if (response.data) {
        setMembers(prevMembers => 
          prevMembers.map(m => 
            m.userId === memberId 
              ? response.data
              : m
          )
        );
      }
    } catch (error) {
      console.error('Error approving join request:', error);
      toast.error('Không thể chấp nhận yêu cầu');
    }
  };

  // Handle reject join request
  const handleRejectRequest = async (memberId: string) => {
    if (!groupId) return;
    
    try {
      await apiRejectJoinRequest(groupId, memberId);
      
      // Remove member from list locally
      setMembers(prevMembers => prevMembers.filter(m => m.userId !== memberId));
      setTotalElements(prev => prev - 1);
    } catch (error) {
      console.error('Error rejecting join request:', error);
      toast.error('Không thể từ chối yêu cầu');
    }
  };

  // Toggle dropdown
  const toggleDropdown = (memberId: string) => {
    setOpenDropdownId(openDropdownId === memberId ? null : memberId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId) {
        setOpenDropdownId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

  return (
    <div className="space-y-4">
      {!isMember && currentUserRole !== 'ADMIN' ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Icon
            icon="fluent:lock-closed-24-regular"
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vui lòng tham gia nhóm
          </h3>
          <p className="text-gray-500">
            Bạn cần tham gia nhóm để xem danh sách thành viên
          </p>
        </div>
      ) : (
        <>
      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Icon icon="fluent:search-24-regular" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <TravelButton
                key={tab.id}
                type={filterTab === tab.id ? 'primary' : 'default'}
                onClick={() => setFilterTab(tab.id)}
                className="text-sm"
              >
                {tab.label} ({tab.count})
              </TravelButton>
            ))}
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Danh sách thành viên ({totalElements})
        </h2>
        
        {loading && page === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Icon icon="fluent:spinner-ios-20-filled" className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={member.userId}
                  ref={index === members.length - 1 ? lastMemberElementRef : null}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/${member.userId}`)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={member.avatar || avatardf}
                      alt={member.fullName}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.fullName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getRoleBadgeColor(member.role)}`}>
                          {getRoleLabel(member.role)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <Icon icon="fluent:calendar-24-regular" className="h-3.5 w-3.5" />
                          <span>Tham gia {formatDate(member.joinedAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Approve/Reject buttons for pending members */}
                    {member.status === 'PENDING' && canManageMembers ? (
                      <>
                        <div onClick={(e) => e.stopPropagation()}>
                          <TravelButton
                            type="primary"
                            onClick={() => handleApproveRequest(member.userId)}
                            className="!px-3 !py-1.5"
                          >
                            <div className="flex items-center gap-1">
                              <Icon icon="fluent:checkmark-24-filled" className="h-4 w-4" />
                              <span className="text-sm">Chấp nhận</span>
                            </div>
                          </TravelButton>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <TravelButton
                            type="default"
                            danger={true}
                            onClick={() => handleRejectRequest(member.userId)}
                            className="!px-3 !py-1.5 !bg-gray-100 hover:!bg-gray-200 transition-colors"
                          >
                            <div className="flex items-center gap-1">
                              <Icon icon="fluent:dismiss-24-filled" className="h-4 w-4" />
                              <span className="text-sm">Từ chối</span>
                            </div>
                          </TravelButton>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Only show chat button if not viewing own profile */}
                        {member.userId !== currentUserId && (
                          <button 
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/messages/${member.userId}`);
                            }}
                          >
                            <Icon icon="fluent:chat-24-regular" className="h-5 w-5" />
                          </button>
                        )}
                        
                        {canChangeRole(member.userId, member.role) && (
                          <div className="relative">
                            <button 
                              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(member.userId);
                              }}
                            >
                              <Icon icon="fluent:more-horizontal-24-filled" className="h-5 w-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdownId === member.userId && (
                              <div 
                                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <div className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase">
                                    Quản lý vai trò
                                  </div>
                                  {getAvailableRoles(member.role).map((role) => (
                                    <button
                                      key={role.value}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRoleChange(member.userId, role.value);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                                    >
                                      <Icon 
                                        icon={role.value === 'MEMBER' ? 'fluent:arrow-down-24-regular' : 'fluent:arrow-up-24-regular'} 
                                        className="h-4 w-4"
                                      />
                                      <span>{role.label}</span>
                                    </button>
                                  ))}
                                  {getAvailableRoles(member.role).length === 0 && (
                                    <div className="px-4 py-2 text-sm text-gray-500 italic">
                                      Không có tùy chọn nào
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator */}
            {loading && members.length > 0 && (
              <div className="flex justify-center py-8">
                <Icon icon="fluent:spinner-ios-20-filled" className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}

            {members.length === 0 && (
              <div className="text-center py-8">
                <Icon icon="fluent:people-search-24-regular" className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không tìm thấy thành viên nào</p>
              </div>
            )}
          </>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default GroupMembersPage;
