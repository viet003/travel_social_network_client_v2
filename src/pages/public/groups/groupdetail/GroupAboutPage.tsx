import React from 'react';
import { Icon } from '@iconify/react';

const GroupAboutPage: React.FC = () => {
  // Mock data - replace with API call
  const groupInfo = {
    description: 'Tại đây các bạn có thể phốt và cục súc một cách thoải mái :)))',
    isPublic: true,
    createdDate: '15 tháng 3, 2023',
    memberCount: 58000,
    postCount: 1250,
    history: 'Nhóm được tạo ra để mọi người có thể chia sẻ những câu chuyện thú vị và hài hước trong cuộc sống.',
  };

  const rules = [
    'Tôn trọng tất cả thành viên trong nhóm',
    'Không spam hoặc quảng cáo',
    'Nội dung phải phù hợp với chủ đề nhóm',
    'Không đăng nội dung bạo lực, khiêu dâm',
    'Tương tác lịch sự và văn minh',
  ];

  const admins = [
    {
      id: 1,
      name: 'Nguyễn Admin',
      avatar: 'https://i.pravatar.cc/60?img=1',
      role: 'Quản trị viên',
    },
    {
      id: 2,
      name: 'Trần Moderator',
      avatar: 'https://i.pravatar.cc/60?img=2',
      role: 'Người kiểm duyệt',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Group Description */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu về nhóm</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {groupInfo.description}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Icon icon="fluent:people-24-filled" className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Thành viên</p>
              <p className="font-semibold text-gray-900">{groupInfo.memberCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Icon icon="fluent:document-24-filled" className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Bài viết</p>
              <p className="font-semibold text-gray-900">{groupInfo.postCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Icon icon={groupInfo.isPublic ? "fluent:globe-24-filled" : "fluent:lock-closed-24-filled"} className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Quyền riêng tư</p>
              <p className="font-semibold text-gray-900">{groupInfo.isPublic ? 'Công khai' : 'Riêng tư'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Icon icon="fluent:calendar-24-filled" className="h-6 w-6 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-semibold text-gray-900">{groupInfo.createdDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Rules */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quy tắc nhóm</h2>
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
              </div>
              <p className="text-gray-700 flex-1">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admins & Moderators */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quản trị viên</h2>
        <div className="space-y-4">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <img
                src={admin.avatar}
                alt={admin.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                <p className="text-sm text-gray-500">{admin.role}</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Nhắn tin
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lịch sử</h2>
        <p className="text-gray-700 leading-relaxed">
          {groupInfo.history}
        </p>
      </div>
    </div>
  );
};

export default GroupAboutPage;
