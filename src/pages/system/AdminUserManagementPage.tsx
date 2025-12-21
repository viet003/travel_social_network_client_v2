import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TravelButton from '../../components/ui/customize/TravelButton';
import TravelInput from '../../components/ui/customize/TravelInput';
import TravelSelect from '../../components/ui/customize/TravelSelect';

// Realistic Mock Data
const mockUsers = [
  { id: '1', name: 'Nguyễn Minh Tuấn', email: 'tuan.nguyen@gmail.com', role: 'USER', status: 'ACTIVE', joinDate: '2023-01-15', avatar: 'https://i.pinimg.com/736x/16/ca/5c/16ca5cd1b7acaf4e7fade587f269165d.jpg' },
  { id: '2', name: 'Trần Thị Thu Hà', email: 'ha.tran@company.vn', role: 'ADMIN', status: 'ACTIVE', joinDate: '2023-02-20', avatar: 'https://i.pinimg.com/736x/84/2b/5e/842b5e9d4cac80ce8e2fd33bca410fb0.jpg' },
  { id: '3', name: 'Lê Hoàng Nam', email: 'nam.le@outlook.com', role: 'USER', status: 'BANNED', joinDate: '2023-03-10', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Phạm Ngọc Anh', email: 'anh.pham@yahoo.com', role: 'USER', status: 'ACTIVE', joinDate: '2023-04-05', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Hoàng Văn Đức', email: 'duc.hoang@tech.vn', role: 'MODERATOR', status: 'ACTIVE', joinDate: '2023-05-12', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'Vũ Thị Mai', email: 'mai.vu@gmail.com', role: 'USER', status: 'ACTIVE', joinDate: '2023-06-01', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', name: 'Đặng Quốc Bảo', email: 'bao.dang@student.edu.vn', role: 'USER', status: 'ACTIVE', joinDate: '2023-06-15', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: '8', name: 'Bùi Phương Thảo', email: 'thao.bui@agency.com', role: 'USER', status: 'ACTIVE', joinDate: '2023-07-02', avatar: 'https://i.pravatar.cc/150?u=8' },
];

const userGrowthData = [
  { name: 'Thứ 2', value: 8 },
  { name: 'Thứ 3', value: 14 },
  { name: 'Thứ 4', value: 17 },
  { name: 'Thứ 5', value: 11 },
  { name: 'Thứ 6', value: 19 },
  { name: 'Thứ 7', value: 20 },
  { name: 'Chủ Nhật', value: 16 },
];

const userRoleData = [
  { name: 'Người dùng', value: 95, color: '#3b82f6' },
  { name: 'Admin', value: 3, color: '#a855f7' },
  { name: 'Kiểm duyệt viên', value: 7, color: '#f59e0b' },
];

const AdminUserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi và quản lý tài khoản thành viên</p>
        </div>
        <TravelButton type="primary" className="flex items-center gap-2">
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
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
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
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
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
                      user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Icon icon="fluent:edit-24-regular" className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Khóa tài khoản">
                        <Icon icon="fluent:lock-closed-24-regular" className="w-5 h-5" />
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
    </div>
  );
};

export default AdminUserManagementPage;
