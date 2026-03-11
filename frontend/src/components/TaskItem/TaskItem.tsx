import type { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => Promise<void>;
}

export function TaskItem({ task, onComplete }: TaskItemProps) {
  const formattedDate = new Date(task.createdAt).toLocaleDateString();

  const handleComplete = () => {
    if (!task.completed) {
      onComplete(task.id);
    }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleComplete}
          disabled={task.completed}
          aria-label={`Mark "${task.title}" as completed`}
        />
        <span className="task-title">{task.title}</span>
      </div>
      <span className="task-date">{formattedDate}</span>
    </li>
  );
}
