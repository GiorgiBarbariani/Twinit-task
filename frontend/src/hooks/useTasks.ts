import { useState, useEffect, useCallback } from 'react';
import type { Task, FilterType, PaginatedResponse } from '../types/task';
import { fetchTasks, createTask, completeTask, ApiError } from '../api/taskApi';

interface UseTasksState {
  tasks: Task[];
  pagination: PaginatedResponse<Task>['pagination'] | null;
  loading: boolean;
  error: string | null;
}

interface UseTasksReturn extends UseTasksState {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  page: number;
  setPage: (page: number) => void;
  addTask: (title: string) => Promise<void>;
  markComplete: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTasks(limit: number = 10): UseTasksReturn {
  const [state, setState] = useState<UseTasksState>({
    tasks: [],
    pagination: null,
    loading: true,
    error: null,
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);

  const loadTasks = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetchTasks(filter, page, limit);
      setState({
        tasks: response.data,
        pagination: response.pagination,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load tasks';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [filter, page, limit]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const addTask = useCallback(
    async (title: string) => {
      setState((prev) => ({ ...prev, error: null }));
      try {
        await createTask(title);
        await loadTasks();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to create task';
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      }
    },
    [loadTasks]
  );

  const markComplete = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, error: null }));
      try {
        await completeTask(id);
        await loadTasks();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to complete task';
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      }
    },
    [loadTasks]
  );

  return {
    ...state,
    filter,
    setFilter,
    page,
    setPage,
    addTask,
    markComplete,
    refresh: loadTasks,
  };
}
