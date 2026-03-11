import { useTasks } from './hooks/useTasks';
import {
  TaskForm,
  TaskList,
  TaskFilter,
  Pagination,
  ErrorMessage,
} from './components';
import './App.css';

function App() {
  const {
    tasks,
    pagination,
    loading,
    error,
    filter,
    setFilter,
    page,
    setPage,
    addTask,
    markComplete,
    refresh,
  } = useTasks();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
      </header>

      <main className="app-main">
        <TaskForm onSubmit={addTask} disabled={loading} />

        {error && <ErrorMessage message={error} onRetry={refresh} />}

        <TaskFilter filter={filter} onFilterChange={setFilter} />

        <TaskList tasks={tasks} onComplete={markComplete} loading={loading} />

        {pagination && (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
