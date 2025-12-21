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
  totalPages: number;
  totalElements: number;
  size?: number;
  number?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
  last?: boolean;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
