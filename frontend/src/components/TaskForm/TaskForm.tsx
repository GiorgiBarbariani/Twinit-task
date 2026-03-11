import { useState, FormEvent } from 'react';

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>;
  disabled?: boolean;
}

export function TaskForm({ onSubmit, disabled }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(trimmedTitle);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new task..."
        disabled={disabled || submitting}
        aria-label="Task title"
      />
      <button type="submit" disabled={disabled || submitting || !title.trim()}>
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
