import axiosConfig from "../configurations/axiosConfig";
import type {
  TripResponse,
  TripScheduleResponse,
  TripDto,
  TripScheduleDto,
  PageableResponse,
  ApiResponse,
  TripStatus,
  ActivityType
} from "../types/trip.types";

// ========== TRIP OPERATIONS ==========

/**
 * Create a new trip
 * Endpoint: POST /trips
 * Description: Create a new trip for a conversation with optional cover image
 * @param tripDto - Trip data transfer object
 * @returns Created trip response
 */
export const apiCreateTrip = async (
  tripDto: TripDto & { coverImage?: File }
): Promise<ApiResponse<TripResponse>> => {
  try {
    const formData = new FormData();
    formData.append('conversationId', tripDto.conversationId);
    formData.append('tripName', tripDto.tripName);
    if (tripDto.tripDescription) formData.append('tripDescription', tripDto.tripDescription);
    if (tripDto.coverImage) formData.append('coverImage', tripDto.coverImage);
    if (tripDto.destination) formData.append('destination', tripDto.destination);
    formData.append('startDate', tripDto.startDate);
    formData.append('endDate', tripDto.endDate);
    if (tripDto.budget) formData.append('budget', tripDto.budget.toString());
    formData.append('status', tripDto.status || 'PLANNING');

    const response = await axiosConfig({
      method: 'POST',
      url: '/trips',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Update a trip
 * Endpoint: PUT /trips/{tripId}
 * Description: Update an existing trip with optional cover image
 * @param tripId - Trip UUID
 * @param tripDto - Trip data transfer object
 * @returns Updated trip response
 */
export const apiUpdateTrip = async (
  tripId: string,
  tripDto: TripDto & { coverImage?: File }
): Promise<ApiResponse<TripResponse>> => {
  try {
    const formData = new FormData();
    formData.append('conversationId', tripDto.conversationId);
    formData.append('tripName', tripDto.tripName);
    if (tripDto.tripDescription) formData.append('tripDescription', tripDto.tripDescription);
    if (tripDto.coverImage) formData.append('coverImage', tripDto.coverImage);
    if (tripDto.destination) formData.append('destination', tripDto.destination);
    formData.append('startDate', tripDto.startDate);
    formData.append('endDate', tripDto.endDate);
    if (tripDto.budget) formData.append('budget', tripDto.budget.toString());
    formData.append('status', tripDto.status || 'PLANNING');

    const response = await axiosConfig({
      method: 'PUT',
      url: `/trips/${tripId}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get trip by ID
 * Endpoint: GET /trips/{tripId}
 * Description: Retrieve a specific trip by its ID
 * @param tripId - Trip UUID
 * @returns Trip response
 */
export const apiGetTripById = async (
  tripId: string
): Promise<ApiResponse<TripResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/${tripId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Delete a trip
 * Endpoint: DELETE /trips/{tripId}
 * Description: Delete a trip (only by creator)
 * @param tripId - Trip UUID
 * @returns Success response
 */
export const apiDeleteTrip = async (
  tripId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/trips/${tripId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get trips by conversation
 * Endpoint: GET /trips/conversation/{conversationId}
 * Description: Retrieve all trips for a specific conversation
 * @param conversationId - Conversation UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @param sortBy - Sort field (default: 'startDate')
 * @param sortDirection - Sort direction (default: 'DESC')
 * @returns Pageable response containing trips
 */
export const apiGetTripsByConversation = async (
  conversationId: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = 'startDate',
  sortDirection: 'ASC' | 'DESC' = 'DESC'
): Promise<ApiResponse<PageableResponse<TripResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/conversation/${conversationId}`,
      params: { page, size, sortBy, sortDirection }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get trips by user
 * Endpoint: GET /trips/user/{userId}
 * Description: Retrieve all trips that a user is part of
 * @param userId - User UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing trips
 */
export const apiGetTripsByUser = async (
  userId: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<TripResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/user/${userId}`,
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Search trips
 * Endpoint: GET /trips/conversation/{conversationId}/search
 * Description: Search trips by keyword in a conversation
 * @param conversationId - Conversation UUID
 * @param keyword - Search keyword
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing search results
 */
export const apiSearchTrips = async (
  conversationId: string,
  keyword: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<TripResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/conversation/${conversationId}/search`,
      params: { keyword, page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get trips by status
 * Endpoint: GET /trips/conversation/{conversationId}/status/{status}
 * Description: Get trips filtered by status in a conversation
 * @param conversationId - Conversation UUID
 * @param status - Trip status
 * @returns List of trips with the specified status
 */
export const apiGetTripsByStatus = async (
  conversationId: string,
  status: TripStatus
): Promise<ApiResponse<TripResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/conversation/${conversationId}/status/${status}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

// ========== TRIP SCHEDULE OPERATIONS ==========

/**
 * Create a trip schedule
 * Endpoint: POST /trips/schedules
 * Description: Create a new schedule/activity for a trip
 * @param scheduleDto - Schedule data transfer object
 * @returns Created schedule response
 */
export const apiCreateSchedule = async (
  scheduleDto: TripScheduleDto
): Promise<ApiResponse<TripScheduleResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: '/trips/schedules',
      data: scheduleDto
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Update a schedule
 * Endpoint: PUT /trips/schedules/{scheduleId}
 * Description: Update an existing trip schedule
 * @param scheduleId - Schedule UUID
 * @param scheduleDto - Schedule data transfer object
 * @returns Updated schedule response
 */
export const apiUpdateSchedule = async (
  scheduleId: string,
  scheduleDto: TripScheduleDto
): Promise<ApiResponse<TripScheduleResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/trips/schedules/${scheduleId}`,
      data: scheduleDto
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get schedule by ID
 * Endpoint: GET /trips/schedules/{scheduleId}
 * Description: Retrieve a specific schedule by its ID
 * @param scheduleId - Schedule UUID
 * @returns Schedule response
 */
export const apiGetScheduleById = async (
  scheduleId: string
): Promise<ApiResponse<TripScheduleResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/schedules/${scheduleId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Delete a schedule
 * Endpoint: DELETE /trips/schedules/{scheduleId}
 * Description: Delete a trip schedule
 * @param scheduleId - Schedule UUID
 * @returns Success response
 */
export const apiDeleteSchedule = async (
  scheduleId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/trips/schedules/${scheduleId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get schedules by trip
 * Endpoint: GET /trips/{tripId}/schedules
 * Description: Retrieve all schedules for a specific trip
 * @param tripId - Trip UUID
 * @returns List of schedules
 */
export const apiGetSchedulesByTrip = async (
  tripId: string
): Promise<ApiResponse<TripScheduleResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/${tripId}/schedules`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get schedules by date
 * Endpoint: GET /trips/{tripId}/schedules/date
 * Description: Retrieve schedules for a specific date
 * @param tripId - Trip UUID
 * @param date - Date in ISO 8601 format
 * @returns List of schedules
 */
export const apiGetSchedulesByDate = async (
  tripId: string,
  date: string
): Promise<ApiResponse<TripScheduleResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/${tripId}/schedules/date`,
      params: { date }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get schedules by activity type
 * Endpoint: GET /trips/{tripId}/schedules/type/{activityType}
 * Description: Retrieve schedules by activity type
 * @param tripId - Trip UUID
 * @param activityType - Activity type
 * @returns List of schedules
 */
export const apiGetSchedulesByActivityType = async (
  tripId: string,
  activityType: ActivityType
): Promise<ApiResponse<TripScheduleResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/${tripId}/schedules/type/${activityType}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get schedules by date range
 * Endpoint: GET /trips/{tripId}/schedules/range
 * Description: Retrieve schedules within a date range
 * @param tripId - Trip UUID
 * @param startDate - Start date in ISO 8601 format
 * @param endDate - End date in ISO 8601 format
 * @returns List of schedules
 */
export const apiGetSchedulesByDateRange = async (
  tripId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<TripScheduleResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/trips/${tripId}/schedules/range`,
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};
