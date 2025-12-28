import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ConfirmDeleteModal } from '../../components/modal';
import { 
  apiGetDashboardStats, 
  apiGetTrafficData, 
  apiGetRecentUsers, 
  apiGetRecentActivities,
  apiUpdateUserStatus,
  apiDeleteUser,
} from '../../services/adminDashboardService';
import type { 
  DashboardStats, 
  TrafficData, 
  RecentUser, 
  RecentActivity 
} from '../../types/adminDashboard.types';
import { formatTimeAgo } from '../../utilities/helper';
import avatarDefault from '../../assets/images/avatar_default.png';
import EditUserModal from '../../components/admin/EditUserModal';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<RecentUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<RecentUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, trafficDataResponse, usersData, activitiesData] = await Promise.all([
          apiGetDashboardStats(),
          apiGetTrafficData(7),
          apiGetRecentUsers(5),
          apiGetRecentActivities(10)
        ]);

        setStats(statsData);
        setTrafficData(trafficDataResponse);
        setRecentUsers(usersData);
        setRecentActivities(activitiesData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditUser = (userId: string) => {
    const user = recentUsers.find(u => u.userId === userId);
    if (user) {
      setEditingUser(user);
      setIsEditModalOpen(true);
    }
  };

  const handleRefreshUsers = async () => {
    try {
      // Refresh user list
      const usersData = await apiGetRecentUsers(5);
      setRecentUsers(usersData);
    } catch (err) {
      console.error('Error refreshing users:', err);
    }
  };

  const handleLockUser = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await apiUpdateUserStatus(userId, newStatus as 'ACTIVE' | 'INACTIVE' | 'BANNED');
      
      // Refresh data
      const usersData = await apiGetRecentUsers(5);
      setRecentUsers(usersData);
    } catch (err) {
      console.error('Error locking/unlocking user:', err);
      alert('Không thể cập nhật trạng thái người dùng');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = recentUsers.find(u => u.userId === userId);
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
      
      // Refresh data
      const usersData = await apiGetRecentUsers(5);
      setRecentUsers(usersData);
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Không thể xóa người dùng');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon icon="fluent:error-circle-24-filled" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const statsDisplay = [
    { 
      title: 'Tổng người dùng', 
      value: stats?.totalUsers?.toString() || '0', 
      change: `${(stats?.userGrowthRate ?? 0) >= 0 ? '+' : ''}${stats?.userGrowthRate ?? 0}%`, 
      icon: 'fluent:people-24-filled', 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Chuyến đi mới', 
      value: stats?.totalTrips?.toString() || '0', 
      change: `${(stats?.tripGrowthRate ?? 0) >= 0 ? '+' : ''}${stats?.tripGrowthRate ?? 0}%`, 
      icon: 'fluent:airplane-24-filled', 
      color: 'bg-emerald-500' 
    },
    { 
      title: 'Bài viết', 
      value: stats?.totalPosts?.toString() || '0', 
      change: `${(stats?.postGrowthRate ?? 0) >= 0 ? '+' : ''}${stats?.postGrowthRate ?? 0}%`, 
      icon: 'fluent:news-24-filled', 
      color: 'bg-amber-500' 
    },
    { 
      title: 'Báo cáo vi phạm', 
      value: stats?.totalReports?.toString() || '0', 
      change: `${(stats?.reportGrowthRate ?? 0) >= 0 ? '+' : ''}${stats?.reportGrowthRate ?? 0}%`, 
      icon: 'fluent:warning-24-filled', 
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Icon icon="fluent:board-24-filled" className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
          <p className="text-gray-500 text-sm mt-1">Thống kê và phân tích hoạt động nền tảng</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.replace('bg-', '')}`}>
                 {/* Note: Tailwind dynamic classes might not work if not safelisted, so I'll use inline style or fixed classes if needed. 
                     For now, let's use a safe approach with fixed classes mapping or just simple colors.
                 */}
                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
                    <Icon icon={stat.icon} className="w-6 h-6" />
                 </div>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                parseFloat(stat.change) >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section (Placeholder) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Thống kê truy cập</h3>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>7 ngày qua</option>
              <option>Tháng này</option>
              <option>Năm nay</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Hoạt động gần đây</h3>
          <div className="space-y-6">
            {recentActivities.slice(0, 4).map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Người dùng mới</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">Quản lý người dùng</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium">Người dùng</th>
                <th className="px-6 py-4 font-medium">Vai trò</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.userId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatarImg || avatarDefault} 
                        alt={user.userName}
                        className="w-8 h-8 rounded-full object-cover"
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
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditUser(user.userId)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Icon icon="fluent:edit-24-regular" className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleLockUser(user.userId, user.status)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        <Icon 
                          icon={user.status === 'ACTIVE' ? 'fluent:lock-closed-24-regular' : 'fluent:lock-open-24-regular'} 
                          className="w-5 h-5" 
                        />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.userId)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        open={isEditModalOpen}
        user={editingUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={handleRefreshUsers}
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

export default AdminDashboardPage;
