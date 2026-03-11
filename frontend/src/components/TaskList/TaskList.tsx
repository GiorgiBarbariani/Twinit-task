import type { Task } from '../../types/task';
import { TaskItem } from '../TaskItem';

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function TaskList({ tasks, onComplete, loading }: TaskListProps) {
  if (loading) {
    return <div className="task-list-loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="task-list-empty">No tasks found</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onComplete={onComplete} />
      ))}
    </ul>
  );
}
