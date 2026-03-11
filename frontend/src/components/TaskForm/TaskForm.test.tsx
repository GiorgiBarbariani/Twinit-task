import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('renders input and submit button', () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    expect(screen.getByPlaceholderText('Enter a new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).toBeDisabled();
  });

  it('enables submit button when input has text', () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    const input = screen.getByPlaceholderText('Enter a new task...');
    fireEvent.change(input, { target: { value: 'New task' } });

    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onSubmit with trimmed title and clears input', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Enter a new task...');
    fireEvent.change(input, { target: { value: '  New task  ' } });

    const button = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('New task');
    });

    expect(input).toHaveValue('');
  });

  it('shows loading state while submitting', async () => {
    const onSubmit = vi.fn().mockImplementation(() => new Promise(() => {}));
    render(<TaskForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Enter a new task...');
    fireEvent.change(input, { target: { value: 'New task' } });

    const button = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /adding/i })).toBeDisabled();
    });
  });
});
