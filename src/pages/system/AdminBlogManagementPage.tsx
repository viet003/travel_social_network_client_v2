import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TravelInput from '../../components/ui/customize/TravelInput';
import { apiGetAllBlogs, apiApproveBlog, apiRejectBlog } from '../../services/adminDashboardService';
import type { AdminBlog } from '../../types/adminBlog.types';
import avatarDefault from '../../assets/images/avatar_default.png';
import ConfirmDeleteModal from '../../components/modal/confirm/ConfirmDeleteModal';

const AdminBlogManagementPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'DRAFT' | 'ARCHIVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | null;
    blogId: string | null;
    blogTitle: string;
  }>({
    isOpen: false,
    action: null,
    blogId: null,
    blogTitle: '',
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await apiGetAllBlogs(100);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBlog = (blogId: string) => {
    // Navigate to blog detail within admin layout
    navigate(`/admin/blog/${blogId}`);
  };

  const handleApproveBlog = async (blogId: string) => {
    try {
      setActionLoading(blogId);
      const updatedBlog = await apiApproveBlog(blogId);
      setBlogs(blogs.map(blog => blog.blogId === blogId ? updatedBlog : blog));
      toast.success('Duyệt bài viết thành công!');
    } catch (error) {
      console.error('Error approving blog:', error);
      toast.error('Không thể duyệt bài viết!');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBlog = async (blogId: string, blogTitle: string) => {
    setConfirmModal({
      isOpen: true,
      action: 'reject',
      blogId,
      blogTitle,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.blogId) return;
    
    try {
      setActionLoading(confirmModal.blogId);
      const updatedBlog = await apiRejectBlog(confirmModal.blogId);
      setBlogs(blogs.map(blog => blog.blogId === confirmModal.blogId ? updatedBlog : blog));
      toast.success('Đã từ chối bài viết!');
    } catch (error) {
      console.error('Error rejecting blog:', error);
      toast.error('Không thể từ chối bài viết!');
    } finally {
      setActionLoading(null);
      setConfirmModal({ isOpen: false, action: null, blogId: null, blogTitle: '' });
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || blog.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' || blog.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Calculate category data dynamically
  const blogCategoryData = [
    { name: 'Kinh nghiệm', value: blogs.filter(b => b.category?.toLowerCase().includes('kinh nghiệm')).length, color: '#3b82f6' },
    { name: 'Review', value: blogs.filter(b => b.category?.toLowerCase().includes('review')).length, color: '#10b981' },
    { name: 'Ẩm thực', value: blogs.filter(b => b.category?.toLowerCase().includes('ẩm thực')).length, color: '#f59e0b' },
    { name: 'Check-in', value: blogs.filter(b => b.category?.toLowerCase().includes('check-in') || b.category?.toLowerCase().includes('checkin')).length, color: '#a855f7' },
    { name: 'Khác', value: blogs.filter(b => !b.category || b.category === '').length, color: '#6b7280' },
  ];

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
      case 'DRAFT': return 'Nháp';
      case 'ARCHIVED': return 'Lưu trữ';
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
            <Icon icon="fluent:document-text-24-filled" className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
            <p className="text-gray-500 text-sm mt-1">Kiểm duyệt và quản lý nội dung cộng đồng</p>
          </div>
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
                <h3 className="text-2xl font-bold text-gray-900">{blogs.length}</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">{blogs.filter(b => b.status === 'PENDING').length}</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">{blogs.filter(b => b.status === 'PUBLISHED').length}</h3>
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
                onClick={() => setActiveTab(tab.id as 'ALL' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'DRAFT' | 'ARCHIVED')}
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
                <tr key={blog.blogId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={blog.thumbnailUrl || avatarDefault} 
                        alt={blog.title}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 line-clamp-1" title={blog.title}>{blog.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                          {blog.category && <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{blog.category}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {blog.authorName}
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
                        {blog.viewCount}
                      </span>
                      <span className="flex items-center gap-1" title={`${blog.averageRating?.toFixed(1)} ★ (${blog.totalRatings} đánh giá)`}>
                        <Icon icon="fluent:star-24-filled" className="w-4 h-4" />
                        {blog.totalRatings}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewBlog(blog.blogId)}
                        className="p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer" 
                        title="Xem chi tiết"
                      >
                        <Icon icon="fluent:eye-24-regular" className="w-5 h-5" />
                      </button>
                      {blog.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleApproveBlog(blog.blogId)}
                            disabled={actionLoading === blog.blogId}
                            className="p-2 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Duyệt bài"
                          >
                            {actionLoading === blog.blogId ? (
                              <div className="animate-spin w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full" />
                            ) : (
                              <Icon icon="fluent:checkmark-24-regular" className="w-5 h-5" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleRejectBlog(blog.blogId, blog.title)}
                            disabled={actionLoading === blog.blogId}
                            className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                            title="Từ chối"
                          >
                            {actionLoading === blog.blogId ? (
                              <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                            ) : (
                              <Icon icon="fluent:dismiss-24-regular" className="w-5 h-5" />
                            )}
                          </button>
                        </>
                      )}
                      {blog.status === 'PUBLISHED' && (
                        <button 
                          onClick={() => handleRejectBlog(blog.blogId, blog.title)}
                          disabled={actionLoading === blog.blogId}
                          className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                          title="Gỡ bài"
                        >
                          {actionLoading === blog.blogId ? (
                            <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <Icon icon="fluent:delete-24-regular" className="w-5 h-5" />
                          )}
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

      {/* Confirm Modal */}
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, blogId: null, blogTitle: '' })}
        onConfirm={handleConfirmAction}
        type="custom"
        itemName={confirmModal.blogTitle}
        customTitle="Từ chối bài viết"
        customWarning="Bài viết sẽ bị từ chối và chuyển sang trạng thái lưu trữ. Tác giả sẽ nhận được thông báo."
        isDeleting={actionLoading === confirmModal.blogId}
      />
    </div>
  );
};

export default AdminBlogManagementPage;
