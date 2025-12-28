// Common API response types

export interface ApiResponse<T = unknown> {
  success: boolean;
  status?: string;
  message: string;
  data: T;
  path: string;
  timestamp: string;
  errors?: unknown;
}

export interface PageableResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}
