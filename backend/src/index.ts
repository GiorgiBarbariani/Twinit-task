import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/tasks.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Only start server if this file is run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export { app };
