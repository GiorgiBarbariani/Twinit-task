import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { taskService } from '../services/TaskService.js';

describe('Tasks API', () => {
  beforeEach(() => {
    taskService.clear();
  });

  describe('POST /tasks', () => {
    it('creates a new task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task' })
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'Test Task',
        completed: false,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('returns 400 when title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('Title is required');
    });

    it('returns 400 when title is empty', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body.error).toContain('Title is required');
    });

    it('trims whitespace from title', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: '  Trimmed Task  ' })
        .expect(201);

      expect(response.body.title).toBe('Trimmed Task');
    });
  });

  describe('GET /tasks', () => {
    it('returns empty list when no tasks exist', async () => {
      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('returns all tasks', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1' });
      await request(app).post('/tasks').send({ title: 'Task 2' });

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('filters completed tasks', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1' });
      const { body: task2 } = await request(app)
        .post('/tasks')
        .send({ title: 'Task 2' });
      await request(app).patch(`/tasks/${task2.id}/complete`);

      const response = await request(app)
        .get('/tasks?filter=completed')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
    });

    it('filters active tasks', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1' });
      const { body: task2 } = await request(app)
        .post('/tasks')
        .send({ title: 'Task 2' });
      await request(app).patch(`/tasks/${task2.id}/complete`);

      const response = await request(app)
        .get('/tasks?filter=active')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(false);
    });

    it('paginates results', async () => {
      for (let i = 1; i <= 15; i++) {
        await request(app).post('/tasks').send({ title: `Task ${i}` });
      }

      const response = await request(app)
        .get('/tasks?page=2&limit=5')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toEqual({
        total: 15,
        page: 2,
        limit: 5,
        totalPages: 3,
      });
    });

    it('returns 400 for invalid filter', async () => {
      const response = await request(app)
        .get('/tasks?filter=invalid')
        .expect(400);

      expect(response.body.error).toContain('Invalid filter');
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    it('marks task as completed', async () => {
      const { body: task } = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task' });

      const response = await request(app)
        .patch(`/tasks/${task.id}/complete`)
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('returns 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/tasks/non-existent-id/complete')
        .expect(404);

      expect(response.body.error).toContain('Task not found');
    });
  });
});
