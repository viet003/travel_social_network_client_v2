import React from 'react';
import { Icon } from '@iconify/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const stats = [
  { title: 'Tổng người dùng', value: '105', change: '+8%', icon: 'fluent:people-24-filled', color: 'bg-blue-500' },
  { title: 'Chuyến đi mới', value: '89', change: '+5%', icon: 'fluent:airplane-24-filled', color: 'bg-emerald-500' },
  { title: 'Bài viết', value: '456', change: '+23%', icon: 'fluent:news-24-filled', color: 'bg-amber-500' },
  { title: 'Báo cáo vi phạm', value: '23', change: '-15%', icon: 'fluent:warning-24-filled', color: 'bg-red-500' },
];

const recentUsers = [
  { id: 1, name: 'Minh Phương 🌸', email: 'minhphuong.travel@gmail.com', status: 'Active', date: '2025-12-01' },
  { id: 2, name: 'Backpacker Sài Gòn', email: 'saigonwanderer@gmail.com', status: 'Active', date: '2025-12-02' },
  { id: 3, name: 'Khôi Nguyên', email: 'khoinguyen.explorer@outlook.com', status: 'Inactive', date: '2025-11-28' },
  { id: 4, name: 'Thanh Huyền | Du lịch bụi', email: 'thanhhuyen_traveler@yahoo.com', status: 'Active', date: '2025-12-03' },
  { id: 5, name: 'Anh Tuấn Photography', email: 'tuanpham.photo@gmail.com', status: 'Banned', date: '2025-11-25' },
];

const trafficData = [
  { name: 'Thứ 2', visits: 12 },
  { name: 'Thứ 3', visits: 18 },
  { name: 'Thứ 4', visits: 9 },
  { name: 'Thứ 5', visits: 16 },
  { name: 'Thứ 6', visits: 20 },
  { name: 'Thứ 7', visits: 15 },
  { name: 'Chủ Nhật', visits: 14 },
];

const recentActivities = [
  { 
    title: 'Người dùng mới đăng ký', 
    description: 'Minh Phương 🌸 đã tạo tài khoản mới thông qua Google.', 
    time: '2 phút trước' 
  },
  { 
    title: 'Bài viết mới được đăng', 
    description: 'Backpacker Sài Gòn vừa chia sẻ "Hành trình xuyên Việt 7 ngày".', 
    time: '15 phút trước' 
  },
  { 
    title: 'Báo cáo vi phạm', 
    description: 'Có báo cáo mới về nội dung spam từ người dùng @travel_bot_2024.', 
    time: '1 giờ trước' 
  },
  { 
    title: 'Nhóm mới được tạo', 
    description: 'Thanh Huyền | Du lịch bụi đã tạo nhóm "Phượt miền Tây 2025".', 
    time: '3 giờ trước' 
  },
];

const AdminDashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
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
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
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
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-50 text-green-600' :
                      user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Icon icon="fluent:more-horizontal-24-regular" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
