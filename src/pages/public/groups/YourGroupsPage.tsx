import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { MyGroupCard } from '../../../components/common/cards';
import { apiGetMyGroups, apiGetPendingGroups, apiLeaveGroup } from '../../../services/groupService';
import { toast } from 'react-toastify';
import { formatTimeAgo } from '../../../utilities/helper';
import type { GroupResponse } from '../../../types/group.types';

const YourGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [pendingGroups, setPendingGroups] = useState<GroupResponse[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<GroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      // Fetch pending groups and joined groups in parallel
      const [pendingResponse, joinedResponse] = await Promise.all([
        apiGetPendingGroups(0, 20),
        apiGetMyGroups(0, 100)
      ]);

      setPendingGroups(pendingResponse.data.content);
      setJoinedGroups(joinedResponse.data.content);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Không thể tải danh sách nhóm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewGroup = (id: string) => {
    navigate(`/home/groups/${id}`);
  };

  const handleClickCard = (id: string) => {
    navigate(`/home/groups/${id}`);
  };

  const handleCancelRequest = async (groupId: string) => {
    try {
      await apiLeaveGroup(groupId);
      // Remove the group from pending list
      setPendingGroups(prev => prev.filter(g => g.groupId !== groupId));
      toast.success('Đã hủy yêu cầu tham gia nhóm');
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error('Không thể hủy yêu cầu');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await apiLeaveGroup(groupId);
      // Remove the group from joined list
      setJoinedGroups(prev => prev.filter(g => g.groupId !== groupId));
      toast.success('Đã rời khỏi nhóm');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Không thể rời nhóm');
    }
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
      {/* Pending Group Requests Section */}
      {pendingGroups.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            Yêu cầu tham gia nhóm đang chờ
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Các nhóm bạn đã gửi yêu cầu và đang chờ được chấp nhận
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pendingGroups.map((group) => (
              <MyGroupCard
                key={group.groupId}
                id={group.groupId}
                name={group.groupName}
                avatar={group.coverImageUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop'}
                lastActivity={`Đã yêu cầu tham gia ${group.lastActivityAt ? formatTimeAgo(group.lastActivityAt) : ''}`}
                isPending={true}
                currentUserRole={group.currentUserRole}
                onViewClick={handleViewGroup}
                onCancelRequest={handleCancelRequest}
                onClick={() => handleClickCard(group.groupId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Joined Groups Section */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-2">
          Tất cả các nhóm bạn đã tham gia ({joinedGroups.length})
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Danh sách các nhóm bạn đang là thành viên hoặc quản trị viên
        </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {joinedGroups.map((group) => (
            <MyGroupCard
              key={group.groupId}
              id={group.groupId}
              name={group.groupName}
              avatar={group.coverImageUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop'}
              lastActivity={`Lần hoạt động gần nhất: ${group.lastActivityAt ? formatTimeAgo(group.lastActivityAt) : 'Chưa có hoạt động'}`}
              isPending={false}
              currentUserRole={group.currentUserRole}
              onViewClick={handleViewGroup}
              onLeaveGroup={handleLeaveGroup}
              onClick={() => handleClickCard(group.groupId)}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {joinedGroups.length === 0 && pendingGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Bạn chưa tham gia nhóm nào.</p>
        </div>
      )}
    </div>
  );
};

export default YourGroupsPage;
