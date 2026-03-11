export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'completed' | 'active';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
