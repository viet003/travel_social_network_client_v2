import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/common.types";
import type { MediaUploadResponse } from "../types/media.types";

/**
 * Upload single media file for blog content
 * Endpoint: POST /media/upload
 * @param file File to upload
 * @param type Type of media (default: 'blog')
 * @returns Media upload response with mediaId and URL
 */
export const apiUploadMedia = async (
  file: File,
  type: string = 'blog'
): Promise<ApiResponse<MediaUploadResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await axiosConfig({
      method: 'POST',
      url: '/media/upload',
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
 * Upload multiple media files at once
 * Endpoint: POST /media/upload/batch
 * @param files Array of files to upload
 * @param type Type of media
 * @returns Array of media upload responses
 */
export const apiUploadMultipleMedia = async (
  files: File[],
  type: string = 'blog'
): Promise<ApiResponse<MediaUploadResponse[]>> => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('type', type);

    const response = await axiosConfig({
      method: 'POST',
      url: '/media/upload/batch',
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
 * Delete a media file
 * Endpoint: DELETE /media/{mediaId}
 * @param mediaId Media UUID
 * @returns Success response
 */
export const apiDeleteMedia = async (mediaId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/media/${mediaId}`
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
 * Link uploaded media to a blog
 * Endpoint: POST /media/link
 * @param mediaIds Array of media UUIDs
 * @param blogId Blog UUID
 * @returns Success response
 */
export const apiLinkMediaToBlog = async (
  mediaIds: string[],
  blogId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: '/media/link',
      params: {
        mediaIds: mediaIds.join(','),
        blogId
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
