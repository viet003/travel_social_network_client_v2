import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { OtherGroupCard } from '../../../components/common/cards';
import { apiSearchGroups, apiJoinGroup, type GroupResponse } from '../../../services/groupService';
import { toast } from 'react-toastify';

interface ExtendedGroupResponse extends GroupResponse {
  requestStatus?: 'APPROVED' | 'PENDING';
}

const GroupSuggestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [suggestedGroups, setSuggestedGroups] = useState<ExtendedGroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [joiningGroupIds, setJoiningGroupIds] = useState<Set<string>>(new Set());

  // Fetch suggested groups (groups user is not a member of)
  useEffect(() => {
    fetchSuggestedGroups();
  }, []);

  const fetchSuggestedGroups = async () => {
    setIsLoading(true);
    try {
      // Fetch groups with empty keyword to get random/all groups
      const response = await apiSearchGroups('', 0, 20);
      const allGroups = response.data.content;
      
      // Filter out groups the user is already a member of
      const nonMemberGroups = allGroups.filter(group => !group.isMember);
      setSuggestedGroups(nonMemberGroups);
    } catch (error) {
      console.error('Error fetching suggested groups:', error);
      toast.error('Không thể tải danh sách gợi ý nhóm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (joiningGroupIds.has(groupId)) return;

    setJoiningGroupIds(prev => new Set(prev).add(groupId));
    try {
      const response = await apiJoinGroup(groupId);
      
      // Check the response status
      if (response.data.isMember) {
        // APPROVED - Redirect to group detail page (public group)
        navigate(`/home/groups/${groupId}`);
      } else {
        // PENDING - Update status to show request is pending (private group)
        setSuggestedGroups(prev =>
          prev.map(g =>
            g.groupId === groupId
              ? { ...g, requestStatus: 'PENDING' as const }
              : g
          )
        );
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Không thể tham gia nhóm');
    } finally {
      setJoiningGroupIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  const handleClickGroup = (groupId: string) => {
    navigate(`/home/groups/${groupId}`);
  };

  const handleRemoveGroup = (groupId: string) => {
    // Remove the group from suggestions list
    setSuggestedGroups(prev => prev.filter(g => g.groupId !== groupId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icon icon="fluent:spinner-ios-20-filled" className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Suggested Groups Section */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">
          Gợi ý nhóm cho bạn
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Các nhóm bạn có thể quan tâm
        </p>
        
        {suggestedGroups.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="fluent:people-community-24-regular" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Không có gợi ý nhóm nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {suggestedGroups.map((group) => (
              <OtherGroupCard
                key={group.groupId}
                id={group.groupId}
                name={group.groupName}
                coverImage={group.coverImageUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop'}
                memberCount={group.memberCount}
                postsPerDay={group.postsPerDay}
                privacy={group.privacy}
                friendMembers={group.friendMembers.map(friend => ({
                  name: friend.name,
                  avatar: friend.avatar || 'https://via.placeholder.com/50'
                }))}
                onJoinClick={handleJoinGroup}
                onRemoveClick={handleRemoveGroup}
                onClick={() => handleClickGroup(group.groupId)}
                isJoining={joiningGroupIds.has(group.groupId)}
                requestStatus={group.requestStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSuggestionsPage;
