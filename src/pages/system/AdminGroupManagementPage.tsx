import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TravelInput from '../../components/ui/customize/TravelInput';
import TravelSelect from '../../components/ui/customize/TravelSelect';

// Realistic Mock Data
const mockGroups = [
  { id: '1', name: 'Hội mê du lịch bụi', members: 187, status: 'ACTIVE', createdBy: 'Nguyễn Minh Tuấn', date: '2022-11-10', postsPerDay: 142, category: 'Phượt', thumbnail: 'https://i.pinimg.com/736x/7e/92/a3/7e92a3a332bb71af1ce2c9ded6cdfd1b.jpg' },
  { id: '2', name: 'Review Homestay Đà Lạt', members: 156, status: 'ACTIVE', createdBy: 'Trần Thị Thu Hà', date: '2023-01-05', postsPerDay: 98, category: 'Review', thumbnail: 'https://i.pinimg.com/1200x/4f/49/27/4f49274cebfb08920c2f864637462a3d.jpg' },
  { id: '3', name: 'Phượt Xuyên Việt', members: 198, status: 'WARNING', createdBy: 'Lê Hoàng Nam', date: '2021-08-20', postsPerDay: 176, category: 'Phượt', thumbnail: 'https://i.pinimg.com/1200x/00/8a/b1/008ab12098c70aed501ada315982f70e.jpg' },
  { id: '4', name: 'Săn mây Tà Xùa', members: 134, status: 'ACTIVE', createdBy: 'Phạm Ngọc Anh', date: '2023-03-15', postsPerDay: 76, category: 'Check-in', thumbnail: 'https://statics.vinpearl.com/ta-xua-yen-bai-01_1629083710.jpg' },
  { id: '5', name: 'Cắm trại cuối tuần', members: 89, status: 'BANNED', createdBy: 'Hoàng Văn Đức', date: '2023-04-01', postsPerDay: 0, category: 'Camping', thumbnail: 'https://statics.vinpearl.com/cam-trai-3_1635334223.jpg' },
  { id: '6', name: 'Ẩm thực 3 miền', members: 192, status: 'ACTIVE', createdBy: 'Vũ Thị Mai', date: '2022-05-12', postsPerDay: 165, category: 'Ẩm thực', thumbnail: 'https://statics.vinpearl.com/am-thuc-viet-nam-01_1630908084.jpg' },
  { id: '7', name: 'Tìm bạn đồng hành', members: 167, status: 'ACTIVE', createdBy: 'Đặng Quốc Bảo', date: '2023-02-28', postsPerDay: 124, category: 'Kết nối', thumbnail: 'https://statics.vinpearl.com/du-lich-phu-quoc-1_1634179459.jpg' },
];

const groupCategoryData = [
  { name: 'Phượt', value: 178, color: '#3b82f6' },
  { name: 'Review', value: 134, color: '#10b981' },
  { name: 'Ẩm thực', value: 156, color: '#f59e0b' },
  { name: 'Camping', value: 98, color: '#22c55e' },
  { name: 'Khác', value: 67, color: '#6b7280' },
];

const AdminGroupManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || group.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý nhóm</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các cộng đồng và nhóm du lịch</p>
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
                <h3 className="text-2xl font-bold text-gray-900">{mockGroups.length}</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">{mockGroups.filter(g => g.status === 'ACTIVE').length}</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">{mockGroups.filter(g => g.status !== 'ACTIVE').length}</h3>
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
                <tr key={group.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={group.thumbnail} 
                        alt={group.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{group.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Tạo ngày {new Date(group.date).toLocaleDateString('vi-VN')}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{group.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {group.members.toLocaleString('vi-VN')}
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
                      <button className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="Xem chi tiết">
                        <Icon icon="fluent:eye-24-regular" className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors" title="Cảnh báo">
                        <Icon icon="fluent:warning-24-regular" className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Khóa nhóm">
                        <Icon icon="fluent:lock-closed-24-regular" className="w-5 h-5" />
                      </button>
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
    </div>
  );
};

export default AdminGroupManagementPage;
