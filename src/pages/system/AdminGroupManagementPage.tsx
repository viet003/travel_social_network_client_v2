import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TravelInput from '../../components/ui/customize/TravelInput';
import TravelSelect from '../../components/ui/customize/TravelSelect';
import { apiGetAllGroups } from '../../services/adminDashboardService';
import { apiLockGroup, apiUnlockGroup } from '../../services/groupService';
import { toast } from 'react-toastify';
import type { AdminGroup } from '../../types/adminGroup.types';
import avatarDefault from '../../assets/images/avatar_default.png';

const AdminGroupManagementPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<AdminGroup | null>(null);
  const [lockReason, setLockReason] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleViewGroup = (groupId: string) => {
    navigate(`/admin/group/${groupId}`);
  };

  const handleLockClick = (group: AdminGroup) => {
    setSelectedGroup(group);
    setShowLockModal(true);
    setLockReason('');
  };

  const handleConfirmLock = async () => {
    if (!selectedGroup) return;
    if (!lockReason.trim()) {
      toast.error('Vui lòng nhập lý do khóa nhóm');
      return;
    }

    try {
      await apiLockGroup(selectedGroup.groupId, lockReason);
      
      // Update local state immediately
      setGroups(groups.map(g => 
        g.groupId === selectedGroup.groupId 
          ? { ...g, isLocked: true, status: 'BANNED' as const, moderationReason: lockReason }
          : g
      ));
      
      toast.success('Khóa nhóm thành công');
      setShowLockModal(false);
      setSelectedGroup(null);
      setLockReason('');
    } catch (error) {
      console.error('Error locking group:', error);
      toast.error('Khóa nhóm thất bại');
    }
  };

  const handleUnlock = async (group: AdminGroup) => {
    try {
      await apiUnlockGroup(group.groupId);
      
      // Update local state immediately
      setGroups(groups.map(g => 
        g.groupId === group.groupId 
          ? { ...g, isLocked: false, status: 'ACTIVE' as const, moderationReason: undefined }
          : g
      ));
      
      toast.success('Mở khóa nhóm thành công');
    } catch (error) {
      console.error('Error unlocking group:', error);
      toast.error('Mở khóa nhóm thất bại');
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await apiGetAllGroups(100);
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || group.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupCategoryData = [
    { name: 'Phượt', value: groups.filter(g => g.tags?.includes('Phượt') || g.tags?.includes('phượt')).length, color: '#3b82f6' },
    { name: 'Review', value: groups.filter(g => g.tags?.includes('Review') || g.tags?.includes('review')).length, color: '#10b981' },
    { name: 'Ẩm thực', value: groups.filter(g => g.tags?.includes('Ẩm thực') || g.tags?.includes('ẩm thực')).length, color: '#f59e0b' },
    { name: 'Camping', value: groups.filter(g => g.tags?.includes('Camping') || g.tags?.includes('camping')).length, color: '#22c55e' },
    { name: 'Khác', value: groups.filter(g => !g.tags || g.tags === '').length, color: '#6b7280' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'WARNING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'BANNED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Hoạt động';
      case 'WARNING': return 'Cảnh báo';
      case 'BANNED': return 'Đã khóa';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Icon icon="fluent:people-community-24-filled" className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý nhóm</h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý các cộng đồng và nhóm du lịch</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Groups */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tổng nhóm</p>
                <h3 className="text-2xl font-bold text-gray-900">{groups.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon icon="fluent:people-community-24-filled" className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span className="text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full mr-2">
                <Icon icon="fluent:arrow-trending-20-filled" className="w-3 h-3" />
                +8%
              </span>
              so với tháng trước
            </div>
          </div>

          {/* Active Groups */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Hoạt động</p>
                <h3 className="text-2xl font-bold text-gray-900">{groups.filter(g => g.status === 'ACTIVE').length}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Icon icon="fluent:checkmark-circle-24-filled" className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span className="text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full mr-2">
                <Icon icon="fluent:arrow-trending-20-filled" className="w-3 h-3" />
                +15%
              </span>
              so với tuần trước
            </div>
          </div>

          {/* Warning/Banned Groups */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Cảnh báo/Khóa</p>
                <h3 className="text-2xl font-bold text-gray-900">{groups.filter(g => g.status !== 'ACTIVE').length}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Icon icon="fluent:warning-24-filled" className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span className="text-red-600 font-medium flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full mr-2">
                Cần chú ý
              </span>
              kiểm tra vi phạm
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Phân loại nhóm</h3>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {groupCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <TravelInput
            placeholder="Tìm kiếm nhóm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <TravelSelect
            placeholder="Tất cả trạng thái"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              { value: 'ACTIVE', label: 'Hoạt động' },
              { value: 'WARNING', label: 'Cảnh báo' },
              { value: 'BANNED', label: 'Đã khóa' },
            ]}
            className="w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Tên nhóm</th>
                <th className="px-6 py-4 font-medium">Thành viên</th>
                <th className="px-6 py-4 font-medium">Người tạo</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Hoạt động</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => (
                <tr key={group.groupId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={group.coverImageUrl || avatarDefault} 
                        alt={group.groupName}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{group.groupName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Tạo ngày {new Date(group.createdAt).toLocaleDateString('vi-VN')}</span>
                          {group.tags && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{group.tags}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {group.memberCount.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {group.createdBy}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(group.status)}`}>
                      {getStatusLabel(group.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {group.postsPerDay} bài/ngày
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewGroup(group.groupId)}
                        className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer" 
                        title="Xem chi tiết"
                      >
                        <Icon icon="fluent:eye-24-regular" className="w-5 h-5" />
                      </button>
                      {group.isLocked ? (
                        <button 
                          onClick={() => handleUnlock(group)}
                          className="p-2 text-gray-400 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors cursor-pointer" 
                          title="Mở khóa nhóm"
                        >
                          <Icon icon="fluent:lock-open-24-regular" className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleLockClick(group)}
                          className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer" 
                          title="Khóa nhóm"
                        >
                          <Icon icon="fluent:lock-closed-24-regular" className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredGroups.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy nhóm nào phù hợp.
          </div>
        )}
      </div>

      {/* Lock Group Modal */}
      {showLockModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon icon="fluent:lock-closed-24-filled" className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Khóa nhóm</h3>
                  <p className="text-sm text-gray-500">{selectedGroup.groupName}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do khóa nhóm <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Nhập lý do khóa nhóm này..."
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  <Icon icon="fluent:warning-24-filled" className="inline w-4 h-4 mr-1" />
                  Chủ nhóm sẽ nhận được thông báo về việc nhóm bị khóa
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLockModal(false);
                    setSelectedGroup(null);
                    setLockReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmLock}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xác nhận khóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGroupManagementPage;
