import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskList } from './TaskList';
import type { Task } from '../../types/task';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Test Task',
  completed: false,
  createdAt: '2024-01-15T10:00:00Z',
  ...overrides,
});

describe('TaskList', () => {
  it('renders loading state', () => {
    render(<TaskList tasks={[]} onComplete={vi.fn()} loading={true} />);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} onComplete={vi.fn()} loading={false} />);

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('renders list of tasks', () => {
    const tasks = [
      createTask({ id: '1', title: 'Task 1' }),
      createTask({ id: '2', title: 'Task 2' }),
    ];
    render(<TaskList tasks={tasks} onComplete={vi.fn()} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('renders tasks as list items', () => {
    const tasks = [createTask({ id: '1', title: 'Task 1' })];
    render(<TaskList tasks={tasks} onComplete={vi.fn()} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});
