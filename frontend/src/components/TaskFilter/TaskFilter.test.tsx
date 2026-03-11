import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFilter } from './TaskFilter';

describe('TaskFilter', () => {
  it('renders all filter buttons', () => {
    render(<TaskFilter filter="all" onFilterChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
  });

  it('marks current filter as active', () => {
    render(<TaskFilter filter="completed" onFilterChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Completed' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass('active');
  });

  it('calls onFilterChange when filter button is clicked', () => {
    const onFilterChange = vi.fn();
    render(<TaskFilter filter="all" onFilterChange={onFilterChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Active' }));

    expect(onFilterChange).toHaveBeenCalledWith('active');
  });

  it('sets aria-pressed correctly for active filter', () => {
    render(<TaskFilter filter="active" onFilterChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
