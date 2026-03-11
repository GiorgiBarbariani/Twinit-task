import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types/task';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Test Task',
  completed: false,
  createdAt: '2024-01-15T10:00:00Z',
  ...overrides,
});

describe('TaskItem', () => {
  it('renders task title', () => {
    const task = createTask({ title: 'My Test Task' });
    render(<TaskItem task={task} onComplete={vi.fn()} />);

    expect(screen.getByText('My Test Task')).toBeInTheDocument();
  });

  it('renders creation date', () => {
    const task = createTask({ createdAt: '2024-01-15T10:00:00Z' });
    const { container } = render(<TaskItem task={task} onComplete={vi.fn()} />);

    const dateElement = container.querySelector('.task-date');
    expect(dateElement).toBeInTheDocument();
    expect(dateElement?.textContent).toContain('2024');
  });

  it('shows unchecked checkbox for active task', () => {
    const task = createTask({ completed: false });
    render(<TaskItem task={task} onComplete={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBeDisabled();
  });

  it('shows checked and disabled checkbox for completed task', () => {
    const task = createTask({ completed: true });
    render(<TaskItem task={task} onComplete={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  it('calls onComplete when checkbox is clicked', () => {
    const onComplete = vi.fn();
    const task = createTask({ id: 'task-123' });
    render(<TaskItem task={task} onComplete={onComplete} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onComplete).toHaveBeenCalledWith('task-123');
  });

  it('does not call onComplete when completed task checkbox is clicked', () => {
    const onComplete = vi.fn();
    const task = createTask({ completed: true });
    render(<TaskItem task={task} onComplete={onComplete} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('applies completed styling', () => {
    const task = createTask({ completed: true });
    const { container } = render(<TaskItem task={task} onComplete={vi.fn()} />);

    expect(container.querySelector('.task-item')).toHaveClass('completed');
  });
});
