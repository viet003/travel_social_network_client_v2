import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse, PageableResponse } from "../types/common.types";
import type { GroupResponse, GroupMemberResponse } from "../types/group.types";
import type { PostMediaResponse } from "../types/media.types";

/**
 * Get user's groups (my-groups)
 * Endpoint: GET /group/my-groups
 * Description: Retrieve all groups the current user is a member of, with pagination.
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 5)
 * @returns Pageable response containing user's groups
 */
export const apiGetMyGroups = async (
  page: number = 0,
  size: number = 5
): Promise<ApiResponse<PageableResponse<GroupResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/group/my-groups',
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Get pending groups
 * Endpoint: GET /group/pending-groups
 * Description: Retrieve groups where user has pending join requests.
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 20)
 * @returns Pageable response containing pending groups
 */
export const apiGetPendingGroups = async (
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<PageableResponse<GroupResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/group/pending-groups',
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Search groups by keyword
 * Endpoint: GET /group
 * Description: Search groups by keyword with pagination.
 * @param keyword - Search keyword (default: empty string)
 * @param page - Page number (default: 5)
 * @param size - Page size (default: 5)
 * @returns Pageable response containing search results
 */
export const apiSearchGroups = async (
  keyword: string = '',
  page: number = 0,
  size: number = 5
): Promise<ApiResponse<PageableResponse<GroupResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/group',
      params: { keyword, page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Get group by ID
 * Endpoint: GET /group/{groupId}
 * Description: Retrieve details of a group using its ID.
 * @param groupId - Group UUID
 * @returns Group response
 */
export const apiGetGroupById = async (
  groupId: string
): Promise<ApiResponse<GroupResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/group/${groupId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Create a new group
 * Endpoint: POST /group
 * Content-Type: multipart/form-data
 * Description: Create a new group with name, description, and optional images.
 * @param groupData - Group data including name, description, privacy, and optional images
 * @returns Created group response
 */
export const apiCreateGroup = async (groupData: {
  name: string;
  description?: string;
  privacy: boolean; // true = private, false = public
  cover?: File;
  avatar?: File;
  tags?: string;
}): Promise<ApiResponse<GroupResponse>> => {
  try {
    const formData = new FormData();
    formData.append('name', groupData.name);
    if (groupData.description) {
      formData.append('description', groupData.description);
    }
    formData.append('privacy', String(groupData.privacy));
    if (groupData.tags) {
      formData.append('tags', groupData.tags);
    }
    
    if (groupData.cover) {
      formData.append('cover', groupData.cover);
    }
    if (groupData.avatar) {
      formData.append('avatar', groupData.avatar);
    }

    const response = await axiosConfig({
      method: 'POST',
      url: '/group',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Join a group
 * Endpoint: POST /group/{groupId}/join
 * Description: Send a join request to a group.
 * @param groupId - Group UUID
 * @returns Join group response with status
 */
export const apiJoinGroup = async (
  groupId: string
): Promise<ApiResponse<{ status: string; isMember: boolean }>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/group/${groupId}/join`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Leave a group
 * Endpoint: POST /group/{groupId}/leave
 * Description: Leave a group you are a member of.
 * @param groupId - Group UUID
 * @returns Success response
 */
export const apiLeaveGroup = async (
  groupId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/group/${groupId}/leave`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Get group members
 * Endpoint: GET /group/{groupId}/members
 * Description: Retrieve all members of a group with pagination and filtering.
 * @param groupId - Group UUID
 * @param keyword - Search keyword for member names (default: empty)
 * @param filter - Filter type: "all", "friends", "admins" (default: "all")
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing group members
 */
export const apiGetGroupMembers = async (
  groupId: string,
  keyword: string = '',
  filter: string = 'all',
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<GroupMemberResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/group/${groupId}/members`,
      params: { keyword, filter, page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Change member role
 * Endpoint: PUT /group/{groupId}/members/{targetUserId}/role
 * Description: Update the role of a group member (admin only).
 * @param groupId - Group UUID
 * @param targetUserId - Target user's UUID
 * @param newRole - New role: "ADMIN", "MODERATOR", "MEMBER"
 * @returns Success response
 */
export const apiChangeMemberRole = async (
  groupId: string,
  targetUserId: string,
  newRole: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/group/${groupId}/members/${targetUserId}/role`,
      params: { newRole }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Get group media
 * Endpoint: GET /group/{groupId}/media
 * Description: Retrieve photos or videos from a group.
 * @param groupId - Group UUID
 * @param mediaType - Media type: "IMAGE" or "VIDEO" (default: "IMAGE")
 * @returns List of media items
 */
export const apiGetGroupMedia = async (
  groupId: string,
  mediaType: 'IMAGE' | 'VIDEO' = 'IMAGE'
): Promise<ApiResponse<PostMediaResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/group/${groupId}/media`,
      params: { mediaType }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Approve join request
 * Endpoint: POST /group/{groupId}/members/{targetUserId}/approve
 * Description: Approve a user's join request (admin only).
 * @param groupId - Group UUID
 * @param targetUserId - Target user's UUID
 * @returns Approved member response
 */
export const apiApproveJoinRequest = async (
  groupId: string,
  targetUserId: string
): Promise<ApiResponse<GroupMemberResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/group/${groupId}/members/${targetUserId}/approve`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Update group information
 * Endpoint: PUT /group/{groupId}
 * Content-Type: multipart/form-data
 * Description: Update group name, description, privacy, and cover image (owner/admin only).
 * @param groupId - Group UUID
 * @param groupData - Updated group data including optional cover image
 * @returns Updated group response
 */
export const apiUpdateGroup = async (
  groupId: string,
  groupData: {
    name: string;
    description: string;
    privacy: boolean; // true = private, false = public
    coverImage?: File;
  }
): Promise<ApiResponse<GroupResponse>> => {
  try {
    const formData = new FormData();
    formData.append('name', groupData.name);
    formData.append('description', groupData.description);
    formData.append('privacy', String(groupData.privacy));
    
    if (groupData.coverImage) {
      formData.append('cover', groupData.coverImage);
    }

    const response = await axiosConfig({
      method: 'PUT',
      url: `/group/${groupId}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

/**
 * Reject join request
 * Endpoint: POST /group/{groupId}/members/{targetUserId}/reject
 * Description: Reject a user's join request (admin only).
 * @param groupId - Group UUID
 * @param targetUserId - Target user's UUID
 * @returns Success response
 */
export const apiRejectJoinRequest = async (
  groupId: string,
  targetUserId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/group/${groupId}/members/${targetUserId}/reject`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiLockGroup = async (
  groupId: string,
  reason: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/group/${groupId}/lock`,
      params: { reason }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiUnlockGroup = async (
  groupId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/group/${groupId}/unlock`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};
