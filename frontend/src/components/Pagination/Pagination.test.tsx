import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders pagination controls when totalPages > 1', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls onPageChange with previous page when previous is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /previous/i }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with next page when next is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
