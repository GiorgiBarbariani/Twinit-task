import { v4 as uuidv4 } from 'uuid';
import type { Task, CreateTaskDTO, TasksQueryParams, PaginatedResponse } from '../types/task.js';

/**
 * TaskService handles all task-related business logic.
 * Uses in-memory storage with a Map for O(1) lookups.
 */
export class TaskService {
  private tasks: Map<string, Task> = new Map();

  create(dto: CreateTaskDTO): Task {
    const task: Task = {
      id: uuidv4(),
      title: dto.title.trim(),
      completed: false,
      createdAt: new Date(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  findAll(params: TasksQueryParams = {}): PaginatedResponse<Task> {
    const { filter = 'all', page = 1, limit = 10 } = params;

    let tasks = Array.from(this.tasks.values());

    // Apply filter
    if (filter === 'completed') {
      tasks = tasks.filter((task) => task.completed);
    } else if (filter === 'active') {
      tasks = tasks.filter((task) => !task.completed);
    }

    // Sort by creation date (newest first)
    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Calculate pagination
    const total = tasks.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedTasks = tasks.slice(startIndex, startIndex + limit);

    return {
      data: paginatedTasks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  findById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  markComplete(id: string): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }
    task.completed = true;
    return task;
  }

  // Utility method for testing
  clear(): void {
    this.tasks.clear();
  }
}

// Singleton instance for the application
export const taskService = new TaskService();
