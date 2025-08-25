import axiosConfig from "../config/axiosConfig";

interface ApiResponse<T = any> {
  data: T;
  [key: string]: any;
}

interface GroupChatPayload {
  groupName: string;
  memberIds: string[];
}

export const apiCreateGroupService = async (
  userId: string,
  payload: GroupChatPayload
): Promise<any> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: "POST",
      url: `/chat/users/${userId}/group-chats`,
      params: { groupName: payload.groupName },
      data: payload.memberIds,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiCreatePrivateChatService = async (
  userId: string,
  otherUserId: string
): Promise<any> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: "POST",
      url: `/chat/users/${userId}/private-chat`,
      params: { otherUserId },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiGetUserGroupsService = async (
  userId: string,
  page: number,
  size: number
): Promise<any> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: "GET",
      url: `/chat/users/${userId}/group-chats`,
      params: { page, size },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiSearchGroupsService = async (
  userId: string,
  keyword: string,
  page: number,
  size: number
): Promise<any> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: "GET",
      url: `/chat/users/${userId}/group-chats/search`,
      params: { keyword, page, size },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};
