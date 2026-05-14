export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}


// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Generic types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Branded types for type safety
export type UserId = string & { readonly brand: unique symbol };

export const createUserId = (id: string): UserId => id as UserId;
