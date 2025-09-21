import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd';
import { authAction } from '../../stores/actions';
import { path } from '../../utilities/path';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    dispatch(authAction.logout());
    navigate(path.LANDING);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section Skeleton */}
          <div className="text-center mb-12">
            <Skeleton.Input active size="large" style={{ width: '600px', height: '80px', margin: '0 auto 16px' }} />
            <Skeleton.Input active size="default" style={{ width: '500px', height: '30px', margin: '0 auto' }} />
          </div>

          {/* User Info Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto">
            <Skeleton.Input active size="large" style={{ width: '100%', height: '60px', marginBottom: '24px' }} />
            <Skeleton.Input active size="default" style={{ width: '100%', height: '20px' }} />
          </div>

          {/* Features Grid Skeleton */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <Skeleton.Input active size="large" style={{ width: '100%', height: '50px', marginBottom: '16px' }} />
                <Skeleton.Input active size="default" style={{ width: '100%', height: '20px', marginBottom: '8px' }} />
                <Skeleton.Input active size="default" style={{ width: '80%', height: '20px' }} />
              </div>
            ))}
          </div>

          {/* Call to Action Skeleton */}
          <div className="text-center mt-12">
            <Skeleton.Button active size="large" style={{ width: '200px', height: '50px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-[70px] font-bold text-[var(--travel-primary-500)] mb-4">
            Chào mừng đến với TravelNest!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá thế giới, kết nối với những người bạn đồng hành và tạo ra những kỷ niệm đáng nhớ.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-travel-primary-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.firstName?.charAt(0) || user?.userName?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Xin chào, {user?.firstName || user?.userName || 'Người dùng'}!
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg transform cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-gray-600 text-center">
              Bạn đã đăng nhập thành công vào hệ thống TravelNest. 
              Hãy bắt đầu khám phá những tính năng tuyệt vời của chúng tôi!
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kết nối</h3>
            <p className="text-gray-600">Tìm kiếm và kết nối với những người có cùng sở thích du lịch.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chia sẻ</h3>
            <p className="text-gray-600">Chia sẻ kinh nghiệm du lịch và những khoảnh khắc đáng nhớ.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Khám phá</h3>
            <p className="text-gray-600">Khám phá những điểm đến mới và tạo lịch trình du lịch hoàn hảo.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-travel-primary-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-travel-primary-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform cursor-pointer">
            Bắt đầu khám phá ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
