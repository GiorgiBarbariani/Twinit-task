import type { Task, FilterType, PaginatedResponse } from '../types/task';

const API_BASE = '/tasks';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(error.error || 'Request failed', response.status);
  }
  return response.json();
}

export async function fetchTasks(
  filter: FilterType = 'all',
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Task>> {
  const params = new URLSearchParams({
    filter,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`${API_BASE}?${params}`);
  return handleResponse<PaginatedResponse<Task>>(response);
}

export async function createTask(title: string): Promise<Task> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse<Task>(response);
}

export async function completeTask(id: string): Promise<Task> {
  const response = await fetch(`${API_BASE}/${id}/complete`, {
    method: 'PATCH',
  });
  return handleResponse<Task>(response);
}
