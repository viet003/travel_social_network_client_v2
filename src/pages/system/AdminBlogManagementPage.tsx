import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TravelButton from '../../components/ui/customize/TravelButton';
import TravelInput from '../../components/ui/customize/TravelInput';

// Realistic Mock Data
const mockBlogs = [
  { id: '1', title: 'Kinh nghiệm du lịch Đà Lạt 3 ngày 2 đêm', author: 'Nguyễn Minh Tuấn', status: 'PUBLISHED', date: '2023-06-01', views: 187, likes: 142, category: 'Kinh nghiệm', thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400' },
  { id: '2', title: 'Review chuyến đi Sapa mùa lúa chín', author: 'Trần Thị Thu Hà', status: 'PENDING', date: '2023-06-02', views: 0, likes: 0, category: 'Review', thumbnail: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400' },
  { id: '3', title: 'Top 10 quán cà phê đẹp ở Hà Nội', author: 'Lê Hoàng Nam', status: 'REJECTED', date: '2023-05-28', views: 23, likes: 8, category: 'Ẩm thực', thumbnail: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400' },
  { id: '4', title: 'Hành trình xuyên Việt bằng xe máy', author: 'Phạm Ngọc Anh', status: 'PUBLISHED', date: '2023-05-15', views: 198, likes: 156, category: 'Hành trình', thumbnail: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400' },
  { id: '5', title: 'Ẩm thực đường phố Sài Gòn', author: 'Hoàng Văn Đức', status: 'PENDING', date: '2023-06-03', views: 0, likes: 0, category: 'Ẩm thực', thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
  { id: '6', title: 'Check-in sống ảo tại Phú Quốc', author: 'Vũ Thị Mai', status: 'PUBLISHED', date: '2023-06-10', views: 165, likes: 124, category: 'Check-in', thumbnail: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400' },
  { id: '7', title: 'Leo núi Bà Đen - Tây Ninh', author: 'Đặng Quốc Bảo', status: 'PUBLISHED', date: '2023-06-12', views: 143, likes: 89, category: 'Khám phá', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
];

const blogCategoryData = [
  { name: 'Kinh nghiệm', value: 142, color: '#3b82f6' },
  { name: 'Review', value: 98, color: '#10b981' },
  { name: 'Ẩm thực', value: 87, color: '#f59e0b' },
  { name: 'Check-in', value: 76, color: '#a855f7' },
  { name: 'Khác', value: 53, color: '#6b7280' },
];

const AdminBlogManagementPage = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PUBLISHED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' || blog.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Đã duyệt';
      case 'PENDING': return 'Chờ duyệt';
      case 'REJECTED': return 'Từ chối';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
          <p className="text-gray-500 text-sm mt-1">Kiểm duyệt và quản lý nội dung cộng đồng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Blogs */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tổng bài viết</p>
                <h3 className="text-2xl font-bold text-gray-900">{mockBlogs.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon icon="fluent:document-text-24-filled" className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span className="text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full mr-2">
                <Icon icon="fluent:arrow-trending-20-filled" className="w-3 h-3" />
                +0%
              </span>
              so với tháng trước
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Chờ duyệt</p>
                <h3 className="text-2xl font-bold text-gray-900">{mockBlogs.filter(b => b.status === 'PENDING').length}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Icon icon="fluent:clock-24-filled" className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span className="text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full mr-2">
                Cần xử lý
              </span>
              ngay bây giờ
            </div>
          </div>

          {/* Published */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Đã xuất bản</p>
                <h3 className="text-2xl font-bold text-gray-900">{mockBlogs.filter(b => b.status === 'PUBLISHED').length}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Icon icon="fluent:checkmark-circle-24-filled" className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span className="text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full mr-2">
                <Icon icon="fluent:arrow-trending-20-filled" className="w-3 h-3" />
                +0%
              </span>
              so với tuần trước
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Danh mục bài viết</h3>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blogCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {blogCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'PENDING', label: 'Chờ duyệt' },
              { id: 'PUBLISHED', label: 'Đã duyệt' },
              { id: 'REJECTED', label: 'Từ chối' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <TravelInput
              placeholder="Tìm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Bài viết</th>
                <th className="px-6 py-4 font-medium">Tác giả</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Thống kê</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={blog.thumbnail} 
                        alt={blog.title}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 line-clamp-1" title={blog.title}>{blog.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{new Date(blog.date).toLocaleDateString('vi-VN')}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{blog.category}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {blog.author}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(blog.status)}`}>
                      {getStatusLabel(blog.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-gray-500 text-xs">
                      <span className="flex items-center gap-1">
                        <Icon icon="fluent:eye-24-regular" className="w-4 h-4" />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon="fluent:heart-24-regular" className="w-4 h-4" />
                        {blog.likes}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="Xem chi tiết">
                        <Icon icon="fluent:eye-24-regular" className="w-5 h-5" />
                      </button>
                      {blog.status === 'PENDING' && (
                        <>
                          <button className="p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors" title="Duyệt bài">
                            <Icon icon="fluent:checkmark-24-regular" className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Từ chối">
                            <Icon icon="fluent:dismiss-24-regular" className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {blog.status === 'PUBLISHED' && (
                        <button className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Gỡ bài">
                          <Icon icon="fluent:delete-24-regular" className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBlogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy bài viết nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogManagementPage;
