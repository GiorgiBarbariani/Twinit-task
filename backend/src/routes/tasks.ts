import { Router, Request, Response } from 'express';
import { taskService } from '../services/TaskService.js';
import type { CreateTaskDTO, TasksQueryParams } from '../types/task.js';

const router = Router();

/**
 * POST /tasks
 * Create a new task
 */
router.post('/', (req: Request<{}, {}, CreateTaskDTO>, res: Response) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    return;
  }

  const task = taskService.create({ title });
  res.status(201).json(task);
});

/**
 * GET /tasks
 * List all tasks with optional filtering and pagination
 * Query params: filter (all|completed|active), page, limit
 */
router.get('/', (req: Request<{}, {}, {}, TasksQueryParams>, res: Response) => {
  const filter = req.query.filter as TasksQueryParams['filter'];
  const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;

  // Validate filter
  if (filter && !['all', 'completed', 'active'].includes(filter)) {
    res.status(400).json({ error: 'Invalid filter. Must be one of: all, completed, active' });
    return;
  }

  // Validate pagination params
  if (page < 1 || limit < 1 || limit > 100) {
    res.status(400).json({ error: 'Invalid pagination parameters' });
    return;
  }

  const result = taskService.findAll({ filter, page, limit });
  res.json(result);
});

/**
 * PATCH /tasks/:id/complete
 * Mark a task as completed
 */
router.patch('/:id/complete', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const task = taskService.markComplete(id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(task);
});

export default router;
