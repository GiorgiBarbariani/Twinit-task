import type { FilterType } from '../../types/task';

interface TaskFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function TaskFilter({ filter, onFilterChange }: TaskFilterProps) {
  return (
    <div className="task-filter" role="group" aria-label="Filter tasks">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={filter === value ? 'active' : ''}
          aria-pressed={filter === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
