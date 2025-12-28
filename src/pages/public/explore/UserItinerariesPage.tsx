import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiDeleteTrip, apiGetTripsByUser } from "../../../services/tripService";
import type { TripResponse, TripStatus } from "../../../types/trip.types";
import type { RootState } from "../../../stores/types/storeTypes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TripCreateModal } from "../../../components/modal";
import ConfirmDeleteModal from "../../../components/modal/confirm/ConfirmDeleteModal";
import { path } from "../../../utilities/path";
import { ExpandableContent } from "../../../components";

const UserItinerariesPage = () => {
  const navigate = useNavigate();
  const currentUserId = useSelector((state: RootState) => state.auth.userId);
  
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<TripResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch trips for current user
  const fetchTrips = async (pageNum: number = 0, append: boolean = false) => {
    if (!currentUserId) {
      console.error("User ID not found");
      toast.error("Vui lòng đăng nhập để xem lịch trình");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiGetTripsByUser(currentUserId, pageNum, 10);
      
      if (response.success && response.data) {
        const newTrips = response.data.content;
        
        if (append) {
          setTrips((prev) => [...prev, ...newTrips]);
        } else {
          setTrips(newTrips);
        }
        
        // Check if there are more pages
        setHasMore(response.data.totalPages > pageNum + 1);
      } else {
        setTrips([]);
        setHasMore(false);
      }
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

  // Delete trip - Open confirmation modal
  const handleDeleteClick = (trip: TripResponse) => {
    setTripToDelete(trip);
    setShowDeleteConfirm(true);
  };

  // Confirm delete trip
  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;

    setIsDeleting(true);
    try {
      await apiDeleteTrip(tripToDelete.tripId);
      toast.success("Đã xóa lịch trình thành công");
      // Refresh list
      setPage(0);
      fetchTrips(0);
    } catch (error) {
      console.error("Error deleting trip:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể xóa lịch trình";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setTripToDelete(null);
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
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      {/* Trip Create/Edit Modal */}
      <TripCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleTripSuccess}
        editTrip={editingTrip}
      />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:calendar-ltr-24-filled" className="w-10 h-10 text-gray-900" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lịch trình của bạn</h1>
              <p className="text-gray-600 text-sm">
                Quản lý và theo dõi các kế hoạch du lịch cá nhân
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <Icon icon="fluent:add-24-regular" className="h-5 w-5" />
            <span>Tạo lịch trình mới</span>
          </button>
        </div>
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
            className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center gap-2 font-medium shadow-sm cursor-pointer"
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
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col md:flex-row max-h-[250px]"
            >
              {/* Image Section */}
              <div className="md:w-72 h-56 md:h-auto relative overflow-hidden bg-gray-100 flex-shrink-0">
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
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Icon icon="fluent:edit-24-regular" className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(trip);
                      }}
                      className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Icon icon="fluent:delete-24-regular" className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {trip.tripDescription && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                    <ExpandableContent content={trip.tripDescription} />
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
                    {trip.conversation.conversationAvatar ? (
                      <img 
                        src={trip.conversation.conversationAvatar} 
                        alt={trip.conversation.conversationName || "Group"} 
                        className="w-5 h-5 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <Icon icon="fluent:people-24-regular" className="h-4 w-4" />
                    )}
                    <span className="font-medium">{trip.conversation.conversationName || "Cá nhân"}</span>
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
            className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm hover:shadow inline-flex items-center gap-2 font-medium cursor-pointer"
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTripToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        type="custom"
        itemName={tripToDelete?.tripName || ""}
        customTitle="Xóa lịch trình"
        customWarning="Hành động này sẽ xóa vĩnh viễn lịch trình và tất cả các hoạt động liên quan. Bạn không thể hoàn tác hành động này."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UserItinerariesPage;
