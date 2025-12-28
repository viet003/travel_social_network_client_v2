import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/common.types";

export enum AiRequestType {
  GENERATE = 'generate'
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  type: 'VISIT' | 'MEAL' | 'TRANSPORT' | 'ACCOMMODATION';
  location?: string;
  estimatedCost?: number;
}

export interface DaySchedule {
  day: number;
  title: string;
  activities: Activity[];
}

export interface AiSuggestResponse {
  message: string;
  schedules: DaySchedule[];
}

export const apiGenerateAiSuggestions = async (
  tripId: string,
  prompt: string,
  type?: AiRequestType
): Promise<ApiResponse<AiSuggestResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/ai/trip/${tripId}/suggest`,
      params: { 
        prompt,
        ...(type && { type })
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

export interface ApplyScheduleRequest {
  tripId: string;
  title: string;
  description: string;
  location?: string;
  scheduleDate: string;
  startTime?: string;
  activityType: string;
  estimatedCost?: number;
  orderIndex: number;
}

export const apiApplyAiSuggestions = async (
  tripId: string,
  schedules: DaySchedule[]
): Promise<ApiResponse<any>> => {
  try {
    // Convert AI schedules to API format
    const tripStartDate = new Date(); // Should get from trip data
    const scheduleRequests: ApplyScheduleRequest[] = [];
    
    let orderIndex = 0;
    for (const daySchedule of schedules) {
      const scheduleDate = new Date(tripStartDate);
      scheduleDate.setDate(scheduleDate.getDate() + (daySchedule.day - 1));
      
      for (const activity of daySchedule.activities) {
        const [hours, minutes] = (activity.time || '00:00').split(':');
        const startTime = new Date(scheduleDate);
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        scheduleRequests.push({
          tripId,
          title: activity.title,
          description: activity.description,
          location: activity.location,
          scheduleDate: scheduleDate.toISOString(),
          startTime: startTime.toISOString(),
          activityType: activity.type,
          estimatedCost: activity.estimatedCost,
          orderIndex: orderIndex++
        });
      }
    }
    
    // Create all schedules using existing API
    const results = await Promise.all(
      scheduleRequests.map(schedule => 
        axiosConfig({
          method: 'POST',
          url: '/trips/schedules',
          data: schedule
        })
      )
    );
    
    return {
      data: results.map(r => r.data.data),
      message: `Created ${results.length} schedules successfully`,
      code: 200
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};
