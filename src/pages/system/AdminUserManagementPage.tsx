import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TravelButton from '../../components/ui/customize/TravelButton';
import TravelInput from '../../components/ui/customize/TravelInput';
import TravelSelect from '../../components/ui/customize/TravelSelect';
import EditUserModal from '../../components/admin/EditUserModal';
import CreateUserModal from '../../components/admin/CreateUserModal';
import { ConfirmDeleteModal } from '../../components/modal';
import avatarDefault from '../../assets/images/avatar_default.png';
import { 
  apiGetRecentUsers, 
  apiUpdateUserStatus, 
  apiDeleteUser,
  apiGetTrafficData
} from '../../services/adminDashboardService';
import type { RecentUser, TrafficData } from '../../types/adminDashboard.types';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingUser, setEditingUser] = useState<RecentUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<RecentUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, trafficDataResponse] = await Promise.all([
        apiGetRecentUsers(100),
        apiGetTrafficData(7)
      ]);
      setUsers(usersData);
      setTrafficData(trafficDataResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiGetRecentUsers(100);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (user) {
      setEditingUser(user);
      setIsEditModalOpen(true);
    }
  };

  const handleLockUser = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await apiUpdateUserStatus(userId, newStatus as 'ACTIVE' | 'INACTIVE' | 'BANNED');
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Không thể cập nhật trạng thái người dùng');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (user) {
      setDeletingUser(user);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    try {
      setIsDeleting(true);
      await apiDeleteUser(deletingUser.userId);
      await fetchUsers();
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Không thể xóa người dùng');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userRoleData = [
    { name: 'Người dùng', value: users.filter(u => u.role === 'USER').length, color: '#3b82f6' },
    { name: 'Admin', value: users.filter(u => u.role === 'ADMIN').length, color: '#a855f7' },
    { name: 'Kiểm duyệt viên', value: users.filter(u => u.role === 'MODERATOR').length, color: '#f59e0b' },
  ];

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
            <Icon icon="fluent:people-24-filled" className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
            <p className="text-gray-500 text-sm mt-1">Theo dõi và quản lý tài khoản thành viên</p>
          </div>
        </div>
        <TravelButton 
          type="primary" 
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Icon icon="fluent:add-24-regular" className="w-5 h-5" />
          <span>Thêm mới</span>
        </TravelButton>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Tăng trưởng người dùng mới</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#fff', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Phân bố vai trò</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {userRoleData.map((entry, index) => (
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
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <TravelSelect
            placeholder="Tất cả vai trò"
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            options={[
              { value: 'ALL', label: 'Tất cả vai trò' },
              { value: 'USER', label: 'User' },
              { value: 'ADMIN', label: 'Admin' },
              { value: 'MODERATOR', label: 'Moderator' },
            ]}
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
                <th className="px-6 py-4 font-medium">Người dùng</th>
                <th className="px-6 py-4 font-medium">Vai trò</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatarImg || avatarDefault} 
                        alt={user.userName} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{user.userName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      user.role === 'MODERATOR' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                      user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                      user.status === 'INACTIVE' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-emerald-500' : 
                        user.status === 'INACTIVE' ? 'bg-gray-500' :
                        'bg-red-500'
                      }`}></span>
                      {user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'INACTIVE' ? 'Không hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditUser(user.userId)}
                        className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer" 
                        title="Chỉnh sửa"
                      >
                        <Icon icon="fluent:edit-24-regular" className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleLockUser(user.userId, user.status)}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer" 
                        title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        <Icon 
                          icon={user.status === 'ACTIVE' ? 'fluent:lock-closed-24-regular' : 'fluent:lock-open-24-regular'} 
                          className="w-5 h-5" 
                        />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.userId)}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer" 
                        title="Xóa tài khoản"
                      >
                        <Icon icon="fluent:delete-24-regular" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy người dùng nào phù hợp.
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUsers}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={isEditModalOpen}
        user={editingUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={fetchUsers}
      />

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingUser(null);
          }}
          onConfirm={handleConfirmDelete}
          type="custom"
          itemName={deletingUser.userName}
          customTitle="Xóa người dùng"
          customWarning="Bạn có chắc chắn muốn xóa người dùng này không? Tất cả dữ liệu của người dùng sẽ bị xóa vĩnh viễn và không thể khôi phục."
          showStats={true}
          stats={[
            {
              icon: 'fluent:mail-24-filled',
              label: 'Email',
              value: deletingUser.email
            },
            {
              icon: 'fluent:person-24-filled',
              label: 'Vai trò',
              value: deletingUser.role
            },
            {
              icon: 'fluent:calendar-24-filled',
              label: 'Ngày tham gia',
              value: new Date(deletingUser.createdAt).toLocaleDateString('vi-VN')
            }
          ]}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default AdminUserManagementPage;
