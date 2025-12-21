import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { apiDeleteTrip } from "../../../services/tripService";
import type { TripResponse, TripStatus } from "../../../types/trip.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TripCreateModal } from "../../../components/modal";
import { path } from "../../../utilities/path";

// Mock data for testing
const mockTrips: TripResponse[] = [
  {
    tripId: "1",
    tripName: "Khám phá Đà Lạt",
    tripDescription: "Chuyến đi thư giãn đến thành phố ngàn hoa với khí hậu mát mẻ quanh năm",
    startDate: "2025-12-15",
    endDate: "2025-12-18",
    destination: "Đà Lạt, Lâm Đồng",
    budget: 5000000,
    status: "PLANNING" as TripStatus,
    coverImageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop",
    scheduleCount: 8,
    conversationId: "conv1",
    conversationName: "Chỉ có du lịch",
    conversationImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&h=100&fit=crop",
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-11-20",
    updatedAt: "2025-11-25"
  },
  {
    tripId: "2",
    tripName: "Phú Quốc - Thiên đường biển đảo",
    tripDescription: "Trải nghiệm biển xanh cát trắng và ẩm thực đặc sắc tại đảo ngọc Phú Quốc",
    startDate: "2026-01-05",
    endDate: "2026-01-10",
    destination: "Phú Quốc, Kiên Giang",
    budget: 12000000,
    status: "CONFIRMED" as TripStatus,
    coverImageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    scheduleCount: 12,
    conversationId: "conv2",
    conversationName: "Gia đình số 1",
    conversationImageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop",
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-11-15",
    updatedAt: "2025-11-28"
  },
  {
    tripId: "3",
    tripName: "Hà Nội - Thủ đô ngàn năm văn hiến",
    tripDescription: "Khám phá văn hóa lịch sử và ẩm thực phố cổ Hà Nội",
    startDate: "2025-12-01",
    endDate: "2025-12-05",
    destination: "Hà Nội",
    budget: 8000000,
    status: "ONGOING" as TripStatus,
    coverImageUrl: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&h=300&fit=crop",
    scheduleCount: 15,
    conversationId: "sdfsfs",
    conversationName: null,
    conversationImageUrl: null,
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-10-20",
    updatedAt: "2025-11-30"
  },
  {
    tripId: "4",
    tripName: "Sapa - Vùng đất mù sương",
    tripDescription: "Chinh phục Fansipan và trải nghiệm văn hóa vùng cao",
    startDate: "2025-10-10",
    endDate: "2025-10-14",
    destination: "Sapa, Lào Cai",
    budget: 7000000,
    status: "COMPLETED" as TripStatus,
    coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
    scheduleCount: 10,
    conversationId: "conv3",
    conversationName: "Nhóm Leo núi",
    conversationImageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop",
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-09-15",
    updatedAt: "2025-10-15"
  },
  {
    tripId: "5",
    tripName: "Hội An - Phố cổ ngàn năm",
    tripDescription: "Khám phá kiến trúc cổ và làng nghề truyền thống",
    startDate: "2025-09-20",
    endDate: "2025-09-23",
    destination: "Hội An, Quảng Nam",
    budget: 6000000,
    status: "CANCELLED" as TripStatus,
    coverImageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
    scheduleCount: 6,
    conversationId: "dsfs",
    conversationName: null,
    conversationImageUrl: null,
    createdBy: "user1",
    createdByName: "Nguyễn Văn A",
    createdAt: "2025-08-10",
    updatedAt: "2025-09-15"
  }
];

const UserItinerariesPage = () => {
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripResponse | null>(null);

  // Fetch trips for current user
  const fetchTrips = async (_pageNum: number = 0, append: boolean = false) => {
    // Using mock data instead of API
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (append) {
        setTrips((prev) => [...prev, ...mockTrips]);
      } else {
        setTrips(mockTrips);
      }
      setHasMore(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể tải danh sách lịch trình";
      toast.error(errorMessage);
      setTrips([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTrips(0);
  }, []);

  // Load more trips
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTrips(nextPage, true);
    }
  };

  // Delete trip
  const handleDeleteTrip = async (tripId: string, tripName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lịch trình "${tripName}"?`)) {
      return;
    }

    try {
      await apiDeleteTrip(tripId);
      toast.success("Đã xóa lịch trình thành công");
      // Refresh list
      setPage(0);
      fetchTrips(0);
    } catch (error) {
      console.error("Error deleting trip:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể xóa lịch trình";
      toast.error(errorMessage);
    }
  };

  // Handle create/edit success
  const handleTripSuccess = (trip: TripResponse) => {
    if (editingTrip) {
      // Update existing trip in list
      setTrips(prev => prev.map(t => t.tripId === trip.tripId ? trip : t));
    } else {
      // Add new trip to beginning of list
      setTrips(prev => [trip, ...prev]);
    }
    setIsCreateModalOpen(false);
    setEditingTrip(null);
  };

  // Open create modal
  const handleOpenCreateModal = () => {
    setEditingTrip(null);
    setIsCreateModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (trip: TripResponse) => {
    setEditingTrip(trip);
    setIsCreateModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingTrip(null);
  };

  // Calculate trip duration
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end day
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
  };

  // Format budget
  const formatBudget = (budget: number | null): string => {
    if (!budget) return "Chưa xác định";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(budget);
  };

  // Get status label and color - Clean & Minimal style
  const getStatusConfig = (
    status: TripStatus
  ): { label: string; className: string } => {
    const configs = {
      PLANNING: {
        label: "Đang lên kế hoạch",
        className: "bg-blue-50 text-blue-600 border border-blue-100",
      },
      CONFIRMED: {
        label: "Đã xác nhận",
        className: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      },
      ONGOING: {
        label: "Đang diễn ra",
        className: "bg-amber-50 text-amber-600 border border-amber-100",
      },
      COMPLETED: {
        label: "Đã hoàn thành",
        className: "bg-gray-50 text-gray-600 border border-gray-100",
      },
      CANCELLED: {
        label: "Đã hủy",
        className: "bg-red-50 text-red-600 border border-red-100",
      },
    };
    return configs[status] || configs.PLANNING;
  };

  // Get icon by status
  const getIconByStatus = (status: TripStatus): string => {
    const icons = {
      PLANNING: "fluent:notebook-24-regular",
      CONFIRMED: "fluent:airplane-24-regular",
      ONGOING: "fluent:globe-24-regular",
      COMPLETED: "fluent:checkmark-circle-24-regular",
      CANCELLED: "fluent:dismiss-circle-24-regular",
    };
    return icons[status] || "fluent:map-24-regular";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      {/* Trip Create/Edit Modal */}
      <TripCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleTripSuccess}
        editTrip={editingTrip}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lịch trình của bạn</h1>
          <p className="text-gray-500 mt-2 text-base">
            Quản lý và theo dõi các kế hoạch du lịch cá nhân
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
        >
          <Icon icon="fluent:add-24-regular" className="h-5 w-5" />
          <span>Tạo lịch trình mới</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && trips.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-800"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && trips.length === 0 && (
        <div className="bg-gray-50 rounded-3xl p-16 text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Icon icon="fluent:map-24-regular" className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có lịch trình nào
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Hãy bắt đầu lên kế hoạch cho chuyến đi tiếp theo của bạn để lưu giữ những kỷ niệm đáng nhớ.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2 font-medium shadow-sm"
          >
            <Icon icon="fluent:add-24-regular" className="h-5 w-5" />
            <span>Tạo lịch trình đầu tiên</span>
          </button>
        </div>
      )}

      {/* Trips List */}
      <div className="grid gap-6">
        {trips.map((trip) => {
          const days = calculateDays(trip.startDate, trip.endDate);
          const statusConfig = getStatusConfig(trip.status);
          const iconName = getIconByStatus(trip.status);

          return (
            <div
              key={trip.tripId}
              onClick={() => navigate(`${path.HOME}/${path.TRIP_DETAIL.replace(':tripId', trip.tripId)}`)}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col md:flex-row"
            >
              {/* Image Section */}
              <div className="md:w-72 h-56 md:h-auto relative overflow-hidden bg-gray-100">
                {trip.coverImageUrl ? (
                  <img
                    src={trip.coverImageUrl}
                    alt={trip.tripName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Icon icon={iconName} className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                   <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-white/90 shadow-sm ${statusConfig.className.replace('bg-', 'text-').split(' ')[1]}`}>
                      {statusConfig.label}
                   </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                      <span>{formatDate(trip.startDate)}</span>
                      <span>•</span>
                      <span>{days} ngày</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {trip.tripName}
                    </h3>
                  </div>
                  
                  {/* Action Buttons - Only visible on hover or always visible but subtle */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(trip);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Icon icon="fluent:edit-24-regular" className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrip(trip.tripId, trip.tripName);
                      }}
                      className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Icon icon="fluent:delete-24-regular" className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {trip.tripDescription && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {trip.tripDescription}
                  </p>
                )}

                {/* Footer Info */}
                <div className="mt-auto pt-5 border-t border-gray-50 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Icon icon="fluent:money-24-regular" className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{formatBudget(trip.budget)}</span>
                  </div>
                  
                  {trip.destination && (
                    <div className="flex items-center gap-2">
                      <Icon icon="fluent:location-24-regular" className="h-5 w-5 text-gray-400" />
                      <span>{trip.destination}</span>
                    </div>
                  )}

                  {trip.scheduleCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Icon icon="fluent:list-24-regular" className="h-5 w-5 text-gray-400" />
                      <span>{trip.scheduleCount} hoạt động</span>
                    </div>
                  )}

                  <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                    {trip.conversationImageUrl ? (
                      <img 
                        src={trip.conversationImageUrl} 
                        alt={trip.conversationName || "Group"} 
                        className="w-5 h-5 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <Icon icon="fluent:people-24-regular" className="h-4 w-4" />
                    )}
                    <span className="font-medium">{trip.conversationName || "Cá nhân"}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && trips.length > 0 && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm hover:shadow inline-flex items-center gap-2 font-medium"
          >
            <span>Xem thêm lịch trình</span>
            <Icon icon="fluent:chevron-down-24-regular" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Loading More */}
      {loading && trips.length > 0 && (
        <div className="mt-10 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default UserItinerariesPage;
