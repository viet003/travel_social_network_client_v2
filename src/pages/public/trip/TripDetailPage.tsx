import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import type { TripResponse, TripScheduleResponse, TripStatus } from '../../../types/trip.types';

// Mock Data
const mockTripDetail: TripResponse = {
  tripId: "1",
  tripName: "Khám phá Đà Lạt",
  tripDescription: "Chuyến đi thư giãn đến thành phố ngàn hoa với khí hậu mát mẻ quanh năm. Chúng ta sẽ đi thăm các địa điểm nổi tiếng như Hồ Xuân Hương, Thung lũng Tình Yêu, và thưởng thức cà phê tại các quán view đẹp.",
  startDate: "2025-12-15",
  endDate: "2025-12-18",
  destination: "Đà Lạt, Lâm Đồng",
  budget: 5000000,
  status: "PLANNING" as TripStatus,
  coverImageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&h=600&fit=crop",
  scheduleCount: 8,
  conversationId: "conv1",
  conversationName: "Chỉ có du lịch",
  conversationImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop",
  createdBy: "user1",
  createdByName: "Nguyễn Văn A",
  createdAt: "2025-11-20",
  updatedAt: "2025-11-25"
};

const mockSchedules: TripScheduleResponse[] = [
  {
    tripScheduleId: "s1",
    tripId: "1",
    title: "Khởi hành từ Hà Nội",
    description: "Tập trung tại bến xe Yên Nghĩa",
    location: "Bến xe Yên Nghĩa",
    scheduleDate: "2025-12-15",
    startTime: "2025-12-15T06:00:00",
    endTime: "2025-12-15T12:00:00",
    activityType: "TRANSPORT",
    estimatedCost: 300000,
    notes: "Nhớ mang theo CMND/CCCD",
    orderIndex: 1,
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-11-20",
    updatedAt: "2025-11-20"
  },
  {
    tripScheduleId: "s2",
    tripId: "1",
    title: "Check-in Homestay",
    description: "Nhận phòng và nghỉ ngơi",
    location: "Củi Homestay",
    scheduleDate: "2025-12-15",
    startTime: "2025-12-15T13:00:00",
    endTime: "2025-12-15T14:00:00",
    activityType: "ACCOMMODATION",
    estimatedCost: 0,
    notes: null,
    orderIndex: 2,
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-11-20",
    updatedAt: "2025-11-20"
  },
  {
    tripScheduleId: "s3",
    tripId: "1",
    title: "Tham quan Quảng trường Lâm Viên",
    description: "Chụp hình check-in với nụ hoa Atiso",
    location: "Quảng trường Lâm Viên",
    scheduleDate: "2025-12-15",
    startTime: "2025-12-15T15:00:00",
    endTime: "2025-12-15T17:00:00",
    activityType: "VISIT",
    estimatedCost: 50000,
    notes: null,
    orderIndex: 3,
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-11-20",
    updatedAt: "2025-11-20"
  },
  {
    tripScheduleId: "s4",
    tripId: "1",
    title: "Ăn tối Lẩu gà lá é",
    description: "Thưởng thức đặc sản Đà Lạt",
    location: "Quán Tao Ngộ",
    scheduleDate: "2025-12-15",
    startTime: "2025-12-15T18:00:00",
    endTime: "2025-12-15T20:00:00",
    activityType: "MEAL",
    estimatedCost: 200000,
    notes: "Đặt bàn trước",
    orderIndex: 4,
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-11-20",
    updatedAt: "2025-11-20"
  }
];

import { TripAiSuggestModal } from '../../../components/modal';

const TripDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [schedules, setSchedules] = useState<TripScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setTrip(mockTripDetail);
        setSchedules(mockSchedules);
      } catch (error) {
        console.error("Error fetching trip details:", error);
        toast.error("Không thể tải thông tin lịch trình");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getActivityLabel = (type: string | null) => {
    switch (type) {
      case 'VISIT': return 'Tham quan';
      case 'MEAL': return 'Ăn uống';
      case 'ACCOMMODATION': return 'Lưu trú';
      case 'TRANSPORT': return 'Di chuyển';
      default: return 'Khác';
    }
  };

  const getActivityIcon = (type: string | null) => {
    switch (type) {
      case 'VISIT': return 'fluent:camera-24-regular';
      case 'MEAL': return 'fluent:food-24-regular';
      case 'ACCOMMODATION': return 'fluent:bed-24-regular';
      case 'TRANSPORT': return 'fluent:vehicle-bus-24-regular';
      default: return 'fluent:star-24-regular';
    }
  };

  const getActivityColor = (type: string | null) => {
    switch (type) {
      case 'VISIT': return 'bg-purple-50 text-purple-600';
      case 'MEAL': return 'bg-orange-50 text-orange-600';
      case 'ACCOMMODATION': return 'bg-blue-50 text-blue-600';
      case 'TRANSPORT': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-800"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy lịch trình</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-b-2xl">
        <img 
          src={trip.coverImageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop"} 
          alt={trip.tripName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
        >
          <Icon icon="fluent:arrow-left-24-regular" className="w-6 h-6" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full">
            <Icon icon="fluent:calendar-24-regular" className="w-4 h-4" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{trip.tripName}</h1>
          <div className="flex items-center gap-4 text-sm md:text-base text-gray-100">
            <div className="flex items-center gap-1">
              <Icon icon="fluent:location-24-regular" className="w-5 h-5" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="fluent:money-24-regular" className="w-5 h-5" />
              <span>{formatCurrency(trip.budget)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Icon icon="fluent:text-description-24-regular" className="w-6 h-6 text-blue-600" />
              Mô tả chuyến đi
            </h2>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {trip.tripDescription || "Chưa có mô tả cho chuyến đi này."}
            </p>
          </section>

          {/* Schedule Timeline */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon icon="fluent:timeline-24-regular" className="w-6 h-6 text-blue-600" />
                Lịch trình chi tiết
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                <Icon icon="fluent:add-24-regular" className="w-4 h-4" />
                Thêm hoạt động
              </button>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {schedules.map((schedule, index) => (
                <div key={schedule.tripScheduleId} className="relative flex items-start group">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 -translate-x-1/2 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-500 shadow-sm z-10 group-hover:scale-125 transition-transform"></div>
                  
                  {/* Content Card */}
                  <div className="ml-12 w-full bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getActivityColor(schedule.activityType)}`}>
                            {getActivityLabel(schedule.activityType)}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{schedule.title}</h3>
                        {schedule.description && (
                          <p className="text-gray-500 text-sm mb-2">{schedule.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {schedule.location && (
                            <div className="flex items-center gap-1">
                              <Icon icon="fluent:location-16-regular" className="w-3.5 h-3.5" />
                              {schedule.location}
                            </div>
                          )}
                          {schedule.estimatedCost && schedule.estimatedCost > 0 && (
                            <div className="flex items-center gap-1">
                              <Icon icon="fluent:money-16-regular" className="w-3.5 h-3.5" />
                              {formatCurrency(schedule.estimatedCost)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Icon icon="fluent:edit-16-regular" className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Icon icon="fluent:delete-16-regular" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {schedules.length === 0 && (
                <div className="text-center py-8 ml-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">Chưa có hoạt động nào được lên lịch.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* AI Suggestion Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="w-full p-4 bg-gray-900 text-white rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Icon icon="fluent:sparkle-24-filled" className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Gợi ý lịch trình</div>
                <div className="text-xs text-gray-400">Sử dụng AI để lên kế hoạch</div>
              </div>
            </div>
            <Icon icon="fluent:chevron-right-24-regular" className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>

          {/* Group Info - Clean Design */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {trip.conversationImageUrl ? (
                <img 
                  src={trip.conversationImageUrl} 
                  alt={trip.conversationName || "Group"} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <Icon icon="fluent:people-24-regular" className="w-7 h-7" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{trip.conversationName || "Cá nhân"}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Icon icon="fluent:person-16-regular" className="w-3.5 h-3.5" />
                  <span className="truncate">Tạo bởi {trip.createdByName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Info Card - Minimalist */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin chung</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon icon="fluent:status-24-regular" className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Trạng thái</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                  {trip.status === 'PLANNING' ? 'Đang lên kế hoạch' : 
                   trip.status === 'CONFIRMED' ? 'Đã xác nhận' :
                   trip.status === 'ONGOING' ? 'Đang diễn ra' :
                   trip.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã hủy'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon icon="fluent:calendar-clock-24-regular" className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Ngày tạo</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(trip.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon icon="fluent:clock-24-regular" className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Cập nhật</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(trip.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-2xl h-40 flex items-center justify-center relative overflow-hidden group cursor-pointer border border-gray-200">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-70 transition-opacity grayscale-[30%] group-hover:grayscale-0"></div>
            <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 text-sm font-medium text-gray-800 transform group-hover:scale-105 transition-transform">
              <Icon icon="fluent:map-24-regular" className="w-4 h-4" />
              Xem bản đồ
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggest Modal */}
      <TripAiSuggestModal 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        tripId={tripId || ''}
      />
    </div>
  );
};

export default TripDetailPage;
