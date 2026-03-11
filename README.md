# Task Management Application

A full-stack task management application built with Node.js/Express and React.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Running the Application

**Backend:**
```bash
cd backend
npm install
npm run dev
```
The API will be available at `http://localhost:3001`

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at `http://localhost:5173`

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Architecture Decisions

### Backend

#### Technology Stack
- **Express.js**: Chosen for its simplicity, extensive ecosystem, and widespread adoption. The minimal overhead makes it ideal for a focused REST API.
- **TypeScript**: Provides type safety, better IDE support, and self-documenting code through interfaces.

#### Project Structure
```
backend/
├── src/
│   ├── routes/       # HTTP route handlers
│   ├── services/     # Business logic layer
│   ├── types/        # TypeScript interfaces
│   └── index.ts      # Application entry point
```

#### Design Patterns

1. **Service Layer Pattern**: Business logic is encapsulated in `TaskService`, separating concerns from HTTP handling. This makes the code:
   - Testable in isolation
   - Reusable across different routes
   - Easy to swap storage implementations

2. **Singleton Service**: The `TaskService` instance is exported as a singleton, providing consistent state across the application while maintaining testability through the `clear()` method.

3. **DTO Pattern**: `CreateTaskDTO` defines the shape of incoming data, separating external API contracts from internal domain models.

4. **In-Memory Storage with Map**: Using a `Map<string, Task>` provides O(1) lookups by ID while maintaining insertion order for listing operations.

### Frontend

#### Technology Stack
- **React 18**: Modern React with hooks for state management
- **Vite**: Fast build tool with excellent DX and HMR
- **TypeScript**: Consistent with backend for type safety

#### Project Structure
```
frontend/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── types/        # TypeScript interfaces
│   └── App.tsx       # Root component
```

#### Design Patterns

1. **Custom Hooks for State Management**: `useTasks` encapsulates all task-related state and API interactions, providing:
   - Clean separation of concerns
   - Reusable state logic
   - Simplified component code

2. **Component Composition**: Small, focused components (`TaskForm`, `TaskItem`, `TaskList`, `TaskFilter`, `Pagination`) that:
   - Have single responsibilities
   - Accept props for configuration
   - Are easily testable

3. **API Layer Abstraction**: The `api/taskApi.ts` module centralizes all HTTP requests:
   - Single point for API configuration
   - Consistent error handling via `ApiError` class
   - Easy to mock for testing

4. **Optimistic Updates Consideration**: The current implementation refreshes the full list after mutations for simplicity. For production, optimistic updates could be added for better UX.

### API Design

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | List tasks with filtering/pagination |
| PATCH | `/tasks/:id/complete` | Mark task as completed |

#### Query Parameters (GET /tasks)
- `filter`: `all` | `completed` | `active` (default: `all`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### Response Format
```json
{
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Testing Strategy

- **Backend**: Integration tests using Supertest to verify API behavior end-to-end
- **Frontend**: Component tests using React Testing Library focusing on user interactions

### Trade-offs and Considerations

1. **In-Memory Storage**: Chosen for simplicity as specified. The service layer design allows easy migration to a database by implementing a repository interface.

2. **No Global State Library**: React's built-in hooks are sufficient for this scope. For larger apps, consider Zustand or TanStack Query.

3. **CSS vs CSS-in-JS**: Plain CSS chosen for simplicity and zero runtime overhead. For larger projects, consider CSS Modules or Tailwind.

4. **Pagination**: Server-side pagination implemented for scalability, even with in-memory storage.

5. **Error Handling**: Centralized error handling with user-friendly messages and retry capabilities.
