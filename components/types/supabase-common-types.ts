// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
}

export interface ApiError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// File upload types
export interface FileUploadResponse {
  path: string;
  id: string;
  fullPath: string;
}

// Real-time types
export interface RealtimePayload<T = any> {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T;
  old: T;
  table: string;
  schema: string;
  commit_timestamp: string;
}
