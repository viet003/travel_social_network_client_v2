import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import type {
  TripResponse,
  TripScheduleResponse,
} from "../../../types/trip.types";
import {
  apiGetTripById,
  apiGetSchedulesByTrip,
  apiDeleteSchedule,
} from "../../../services/tripService";
import {
  TripAiSuggestModal,
  TripScheduleModal,
  ConfirmDeleteModal,
} from "../../../components/modal";

const TripDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [schedules, setSchedules] = useState<TripScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<TripScheduleResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] =
    useState<TripScheduleResponse | null>(null);

  const handleOpenCreateSchedule = () => {
    setEditingSchedule(null);
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (schedule: TripScheduleResponse) => {
    setEditingSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSuccess = (schedule: TripScheduleResponse) => {
    if (editingSchedule) {
      // Update existing schedule
      setSchedules((prev) =>
        prev.map((s) =>
          s.tripScheduleId === schedule.tripScheduleId ? schedule : s
        )
      );
    } else {
      // Add new schedule
      setSchedules((prev) => [...prev, schedule]);
    }
    setIsScheduleModalOpen(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (schedule: TripScheduleResponse) => {
    setScheduleToDelete(schedule);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    try {
      const response = await apiDeleteSchedule(scheduleToDelete.tripScheduleId);
      if (response.success) {
        toast.success("Đã xóa hoạt động");
        setSchedules((prev) =>
          prev.filter(
            (s) => s.tripScheduleId !== scheduleToDelete.tripScheduleId
          )
        );
        setIsDeleteModalOpen(false);
        setScheduleToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Không thể xóa hoạt động");
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!tripId) {
        toast.error("ID lịch trình không hợp lệ");
        navigate(-1);
        return;
      }

      setLoading(true);
      try {
        // Fetch trip details
        const tripResponse = await apiGetTripById(tripId);
        if (tripResponse.success && tripResponse.data) {
          setTrip(tripResponse.data);
        } else {
          throw new Error("Không thể tải thông tin lịch trình");
        }

        // Fetch trip schedules
        const schedulesResponse = await apiGetSchedulesByTrip(tripId);
        if (schedulesResponse.success && schedulesResponse.data) {
          setSchedules(schedulesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        toast.error("Không thể tải thông tin lịch trình");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getActivityLabel = (type: string | null) => {
    switch (type) {
      case "VISIT":
        return "Tham quan";
      case "MEAL":
        return "Ăn uống";
      case "ACCOMMODATION":
        return "Lưu trú";
      case "TRANSPORT":
        return "Di chuyển";
      default:
        return "Khác";
    }
  };

  const getActivityColor = (type: string | null) => {
    switch (type) {
      case "VISIT":
        return "bg-purple-50 text-purple-600";
      case "MEAL":
        return "bg-orange-50 text-orange-600";
      case "ACCOMMODATION":
        return "bg-blue-50 text-blue-600";
      case "TRANSPORT":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  // Calculate total cost of all schedules
  const calculateTotalCost = () => {
    return schedules.reduce((total, schedule) => {
      return total + (schedule.estimatedCost || 0);
    }, 0);
  };

  const totalCost = calculateTotalCost();
  const budgetPercentage =
    trip?.budget && trip.budget > 0
      ? Math.min((totalCost / trip.budget) * 100, 100)
      : 0;

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
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy lịch trình
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline cursor-pointer"
        >
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
          src={
            trip.coverImageUrl ||
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop"
          }
          alt={trip.tripName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all cursor-pointer"
        >
          <Icon icon="fluent:arrow-left-24-regular" className="w-6 h-6" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full">
            <Icon icon="fluent:calendar-24-regular" className="w-4 h-4" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {trip.tripName}
          </h1>
          <div className="flex items-center gap-4 text-sm md:text-base text-gray-100">
            <div className="flex items-center gap-1">
              <Icon icon="fluent:location-24-regular" className="w-5 h-5" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="fluent:money-24-regular" className="w-5 h-5" />
              <span>{formatCurrency(trip.budget)}</span>
            </div>
            {trip.conversation.conversationAvatar && (
              <div className="flex items-center gap-2">
                <img
                  src={trip.conversation.conversationAvatar}
                  alt={trip.conversation.conversationName || "Group"}
                  className="w-6 h-6 rounded-full object-cover border-2 border-white/30"
                />
                <span>{trip.conversation.conversationName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Icon
                icon="fluent:text-description-24-regular"
                className="w-6 h-6 text-blue-600"
              />
              Mô tả chuyến đi
            </h2>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {trip.tripDescription || "Chưa có mô tả cho chuyến đi này."}
            </p>
          </section>
          
          {/* Budget Overview Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Icon
                  icon="fluent:wallet-24-filled"
                  className="w-5 h-5 text-blue-600"
                />
                Ngân sách chuyến đi
              </h3>
              {trip.conversation.conversationAvatar && (
                <div className="flex items-center gap-2">
                  <img
                    src={trip.conversation.conversationAvatar}
                    alt={trip.conversation.conversationName || "Group"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {trip.conversation.conversationName}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Đã chi tiêu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Tổng ngân sách</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {formatCurrency(trip.budget)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetPercentage >= 90
                        ? "bg-red-500"
                        : budgetPercentage >= 70
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${budgetPercentage}%` }}
                  >
                    <div className="h-full w-full bg-gradient-to-r from-transparent to-white/30"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {budgetPercentage.toFixed(1)}% ngân sách đã sử dụng
                  {budgetPercentage >= 90 && (
                    <span className="text-red-600 font-medium">
                      {" "}
                      - Cảnh báo: Gần vượt ngân sách!
                    </span>
                  )}
                </p>
              </div>

              {/* Remaining Budget */}
              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <span className="text-sm text-gray-600">Còn lại</span>
                <span
                  className={`text-lg font-bold ${
                    (trip.budget || 0) - totalCost < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {formatCurrency((trip.budget || 0) - totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Timeline */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon
                  icon="fluent:timeline-24-regular"
                  className="w-6 h-6 text-blue-600"
                />
                Lịch trình chi tiết
              </h2>
              <button
                onClick={handleOpenCreateSchedule}
                className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Icon icon="fluent:add-24-regular" className="w-4 h-4" />
                Thêm hoạt động
              </button>
            </div>

            <div
              className={`space-y-6 relative ${
                schedules.length > 0
                  ? "before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent"
                  : ""
              }`}
            >
              {schedules.map((schedule) => (
                <div
                  key={schedule.tripScheduleId}
                  className="relative flex items-start group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 -translate-x-1/2 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-500 shadow-sm z-10 group-hover:scale-125 transition-transform"></div>

                  {/* Content Card */}
                  <div className="ml-12 w-full bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getActivityColor(
                              schedule.activityType
                            )}`}
                          >
                            {getActivityLabel(schedule.activityType)}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {formatTime(schedule.startTime)} -{" "}
                            {formatTime(schedule.endTime)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {schedule.title}
                        </h3>
                        {schedule.description && (
                          <p className="text-gray-500 text-sm mb-2">
                            {schedule.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {schedule.location && (
                            <div className="flex items-center gap-1">
                              <Icon
                                icon="fluent:location-16-regular"
                                className="w-3.5 h-3.5"
                              />
                              {schedule.location}
                            </div>
                          )}
                          {schedule.estimatedCost &&
                            schedule.estimatedCost > 0 && (
                              <div className="flex items-center gap-1">
                                <Icon
                                  icon="fluent:money-16-regular"
                                  className="w-3.5 h-3.5"
                                />
                                {formatCurrency(schedule.estimatedCost)}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditSchedule(schedule)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Icon
                            icon="fluent:edit-16-regular"
                            className="w-5 h-5"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Icon
                            icon="fluent:delete-16-regular"
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {schedules.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">
                    Chưa có hoạt động nào được lên lịch.
                  </p>
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
            className="w-full p-4 cursor-pointer bg-gray-900 text-white rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Icon icon="fluent:sparkle-24-filled" className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Gợi ý lịch trình</div>
                <div className="text-xs text-gray-400">
                  Sử dụng AI để lên kế hoạch
                </div>
              </div>
            </div>
            <Icon
              icon="fluent:chevron-right-24-regular"
              className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors"
            />
          </button>

          {/* Group Info - Clean Design */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {trip.conversation.conversationAvatar ? (
                <img
                  src={trip.conversation.conversationAvatar}
                  alt={trip.conversation.conversationName || "Group"}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <Icon icon="fluent:people-24-regular" className="w-7 h-7" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">
                  {trip.conversation.conversationName || "Cá nhân"}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Icon
                    icon="fluent:person-16-regular"
                    className="w-3.5 h-3.5"
                  />
                  <span className="truncate">Tạo bởi {trip.createdByName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Info Card - Minimalist */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Thông tin chung
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon
                    icon="fluent:status-24-regular"
                    className="w-5 h-5 text-gray-400"
                  />
                  <span className="text-sm">Trạng thái</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                  {trip.status === "PLANNING"
                    ? "Đang lên kế hoạch"
                    : trip.status === "CONFIRMED"
                    ? "Đã xác nhận"
                    : trip.status === "ONGOING"
                    ? "Đang diễn ra"
                    : trip.status === "COMPLETED"
                    ? "Đã hoàn thành"
                    : "Đã hủy"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon
                    icon="fluent:calendar-clock-24-regular"
                    className="w-5 h-5 text-gray-400"
                  />
                  <span className="text-sm">Ngày tạo</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(trip.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon
                    icon="fluent:clock-24-regular"
                    className="w-5 h-5 text-gray-400"
                  />
                  <span className="text-sm">Cập nhật</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(trip.updatedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <Icon
                icon="fluent:map-24-filled"
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-semibold text-gray-800">
                Bản đồ địa điểm
              </span>
            </div>
            <div className="relative w-full h-64">
              <iframe
                title="Google Maps"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  trip.destination || ''
                )}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggest Modal */}
      <TripAiSuggestModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        tripId={tripId || ""}
      />

      {/* Trip Schedule Modal */}
      {tripId && (
        <TripScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setEditingSchedule(null);
          }}
          onSuccess={handleScheduleSuccess}
          tripId={tripId}
          editSchedule={editingSchedule}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setScheduleToDelete(null);
        }}
        onConfirm={confirmDeleteSchedule}
        type="custom"
        itemName={scheduleToDelete?.title || ""}
        customTitle="Xóa hoạt động"
        customWarning="Bạn có chắc chắn muốn xóa hoạt động này khỏi lịch trình? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default TripDetailPage;
