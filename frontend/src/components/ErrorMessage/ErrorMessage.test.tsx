import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders with alert role for accessibility', () => {
    render(<ErrorMessage message="Error" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorMessage message="Error" onRetry={vi.fn()} />);

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
