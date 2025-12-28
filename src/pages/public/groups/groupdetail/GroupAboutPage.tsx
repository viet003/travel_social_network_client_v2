import React from 'react';
import { Icon } from '@iconify/react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetGroupById } from '../../../../services/groupService';
import type { GroupResponse } from '../../../../types/group.types';
import { toast } from 'react-toastify';

const GroupAboutPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [groupData, setGroupData] = React.useState<GroupResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;
      
      setIsLoading(true);
      try {
        const response = await apiGetGroupById(groupId);
        setGroupData(response.data);
      } catch (error) {
        console.error('Error fetching group:', error);
        toast.error('Không thể tải thông tin nhóm');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icon icon="fluent:spinner-ios-20-filled" className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy thông tin nhóm</p>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Không rõ';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Navigate to member profile
  const handleMemberClick = (userId: string) => {
    navigate(`/home/user/${userId}`);
  };

  // Navigate to members page
  const handleViewAllMembers = () => {
    if (groupId) {
      navigate(`/home/groups/${groupId}/members`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Giới thiệu về nhóm */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Giới thiệu về nhóm này</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-700 text-sm mb-4">
            {groupData.groupDescription || 'Ae vào nhóm vui vẻ hòa đồng !'}
          </p>
          
          <div className="space-y-3">
            {/* Công khai/Riêng tư */}
            <div className="flex items-start space-x-3">
              <Icon icon={!groupData.privacy ? "fluent:globe-24-regular" : "fluent:lock-closed-24-regular"} className="h-6 w-6 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{!groupData.privacy ? 'Công khai' : 'Riêng tư'}</p>
                <p className="text-xs text-gray-500">
                  {!groupData.privacy 
                    ? 'Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.' 
                    : 'Chỉ thành viên mới có thể xem nội dung trong nhóm.'}
                </p>
              </div>
            </div>

            {/* Hiện thi */}
            <div className="flex items-start space-x-3">
              <Icon icon="fluent:eye-24-regular" className="h-6 w-6 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Hiện thi</p>
                <p className="text-xs text-gray-500">
                  Ai cũng có thể tìm thấy nhóm này.
                </p>
              </div>
            </div>

            {/* Lịch sử */}
            <div className="flex items-start space-x-3">
              <Icon icon="fluent:history-24-regular" className="h-6 w-6 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Lịch sử</p>
                <p className="text-xs text-gray-500">
                  Đã tạo nhóm vào {formatDate(groupData.createdAt || null)}. Lần gần nhất đổi tên là vào {formatDate(groupData.lastActivityAt || null)}. <span className="text-blue-600 cursor-pointer hover:underline">Xem thêm</span>
                </p>
              </div>
            </div>

            {/* Thẻ */}
            <div className="flex items-start space-x-3">
              <Icon icon="fluent:tag-24-regular" className="h-6 w-6 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Thẻ</p>
                <p className="text-xs text-gray-500">
                  {groupData.tags || 'Tính yêu & sự lãng mạn'}
                </p>
              </div>
            </div>

            {/* Vị trí */}
            <div className="flex items-start space-x-3">
              <Icon icon="fluent:location-24-regular" className="h-6 w-6 text-gray-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{groupData.location || 'Việt Nam'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thành viên */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Thành viên</h2>
            <p className="text-sm text-gray-500">· {groupData.memberCount.toLocaleString()} thành viên</p>
          </div>
        </div>
        <div className="p-4">
          {/* Friend Members Avatars */}
          {groupData.friendMembers && groupData.friendMembers.length > 0 && (
            <>
              <div className="flex items-center mb-3">
                <div className="flex -space-x-2">
                  {groupData.friendMembers.slice(0, 5).map((friend, index) => (
                    <img
                      key={friend.userId}
                      src={friend.avatar || `https://i.pravatar.cc/40?img=${index}`}
                      alt={friend.name}
                      className="w-8 h-8 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                      style={{ zIndex: 5 - index }}
                      onClick={() => handleMemberClick(friend.userId)}
                      title={friend.name}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                <span 
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => handleMemberClick(groupData.friendMembers[0].userId)}
                >
                  {groupData.friendMembers.slice(0, 2).map(f => f.name).join(', ')}
                </span>
                {groupData.friendMembers.length > 2 && (
                  <> và <span className="font-semibold">{groupData.friendMembers.length - 2} người bạn khác</span></>
                )} đã tham gia
              </p>
            </>
          )}
          
          {/* Admin & Moderator Members */}
          {(groupData.adminMembers && groupData.adminMembers.length > 0) || 
           (groupData.moderatorMembers && groupData.moderatorMembers.length > 0) ? (
            <>
              <div className="flex items-center mb-3">
                <div className="flex -space-x-2">
                  {groupData.adminMembers?.slice(0, 5).map((admin, index) => (
                    <img
                      key={admin.userId}
                      src={admin.avatar || `https://i.pravatar.cc/40?img=${index + 10}`}
                      alt={admin.name}
                      className="w-8 h-8 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                      style={{ zIndex: 5 - index }}
                      onClick={() => handleMemberClick(admin.userId)}
                      title={admin.name}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                {groupData.adminMembers && groupData.adminMembers.length > 0 && (
                  <>
                    <span 
                      className="font-semibold cursor-pointer hover:underline"
                      onClick={() => handleMemberClick(groupData.adminMembers[0].userId)}
                    >
                      {groupData.adminMembers.slice(0, 2).map(admin => admin.name).join(', ')}
                    </span>
                    {groupData.adminMembers.length > 2 && (
                      <> và <span className="font-semibold">{groupData.adminMembers.length - 2} thành viên khác</span></>
                    )} là quản trị viên.{' '}
                  </>
                )}
                {groupData.moderatorMembers && groupData.moderatorMembers.length > 0 && (
                  <>
                    <span 
                      className="font-semibold cursor-pointer hover:underline"
                      onClick={() => groupData.moderatorMembers[0] && handleMemberClick(groupData.moderatorMembers[0].userId)}
                    >
                      {groupData.moderatorMembers.slice(0, 2).map(mod => mod.name).join(' và ')}
                    </span>
                    {groupData.moderatorMembers.length > 2 && (
                      <> và <span className="font-semibold">{groupData.moderatorMembers.length - 2} người khác</span></>
                    )} là người kiểm duyệt.
                  </>
                )}
              </p>
            </>
          ) : null}

          <button 
            onClick={handleViewAllMembers}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-sm cursor-pointer"
          >
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Hoạt động */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Hoạt động</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Icon icon="fluent:document-text-24-regular" className="h-6 w-6 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                Hôm nay có {groupData.postsToday || 0} bài viết mới
              </p>
              <p className="text-xs text-gray-500">{groupData.postsLastMonth || 0} trong tháng trước</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <Icon icon="fluent:people-24-regular" className="h-6 w-6 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Tổng cộng {groupData.memberCount.toLocaleString()} thành viên</p>
              <p className="text-xs text-gray-500">+ {groupData.newMembersThisWeek || 0} trong tuần qua</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon icon="fluent:calendar-24-regular" className="h-6 w-6 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Ngày tạo:</p>
              <p className="text-xs text-gray-500">
                {groupData.createdAt ? formatDate(groupData.createdAt) : '5 năm trước'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAboutPage;
