export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTaskDTO {
  title: string;
}

export interface TasksQueryParams {
  filter?: 'all' | 'completed' | 'active';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
