# Backend API Endpoints Summary

## Base URL
**All endpoints are prefixed with `/api/v1`**

**Example**: `https://shanghairevolmsapi.up.railway.app/api/v1/dashboard`

## Authentication Endpoints
- **POST** `/api/v1/auth/login` - User login
- **POST** `/api/v1/auth/register` - User registration

## User Management Endpoints
- **GET** `/api/v1/users/profile` - Get current user profile (protected)
- **GET** `/api/v1/users` - Get all users (protected)
- **GET** `/api/v1/users/:id` - Get user by ID (protected)
- **POST** `/api/v1/users` - Create new user
- **PATCH** `/api/v1/users/:id` - Update user (protected)
- **DELETE** `/api/v1/users/:id` - Delete user (protected)

## Course Management Endpoints
- **GET** `/api/v1/courses` - Get all courses (protected)
- **GET** `/api/v1/courses/:id` - Get course by ID (protected)
- **POST** `/api/v1/courses` - Create new course (protected)
- **PATCH** `/api/v1/courses/:id` - Update course (protected)
- **DELETE** `/api/v1/courses/:id` - Delete course (protected)

## Enrollment Endpoints
- **GET** `/api/v1/enrollments/my-enrollments` - Get current user's enrollments (protected)
- **GET** `/api/v1/enrollments` - Get all enrollments (protected)
- **GET** `/api/v1/enrollments/student/:studentId` - Get enrollments for specific student (protected)
- **GET** `/api/v1/enrollments/course/:courseId` - Get enrollments for specific course (protected)
- **GET** `/api/v1/enrollments/:id` - Get enrollment by ID (protected)
- **POST** `/api/v1/enrollments` - Create new enrollment (protected)
- **PATCH** `/api/v1/enrollments/:id` - Update enrollment (protected)
- **DELETE** `/api/v1/enrollments/:id` - Remove enrollment (protected)

## Dashboard Endpoints
- **GET** `/api/v1/dashboard` - Get dashboard data for current user (protected)

## Todos Endpoints
- **GET** `/api/v1/todos` - Get current user's todos (protected)

## Feedback Endpoints
- **GET** `/api/v1/feedback/recent` - Get recent feedback for current user (protected)

## Module Management Endpoints
- **GET** `/api/v1/modules` - Get all modules (protected)
- **GET** `/api/v1/modules/:id` - Get module by ID (protected)
- **POST** `/api/v1/modules` - Create new module (protected)
- **PATCH** `/api/v1/modules/:id` - Update module (protected)
- **DELETE** `/api/v1/modules/:id` - Delete module (protected)

## Lesson Management Endpoints
- **GET** `/api/v1/lessons` - Get all lessons (protected)
- **GET** `/api/v1/lessons/:id` - Get lesson by ID (protected)
- **POST** `/api/v1/lessons` - Create new lesson (protected)
- **PATCH** `/api/v1/lessons/:id` - Update lesson (protected)
- **DELETE** `/api/v1/lessons/:id` - Delete lesson (protected)

## Assignment Management Endpoints
- **GET** `/api/v1/assignments` - Get all assignments (protected)
- **GET** `/api/v1/assignments/:id` - Get assignment by ID (protected)
- **POST** `/api/v1/assignments` - Create new assignment (protected)
- **PATCH** `/api/v1/assignments/:id` - Update assignment (protected)
- **DELETE** `/api/v1/assignments/:id` - Delete assignment (protected)

## Submission Management Endpoints
- **GET** `/api/v1/submissions` - Get all submissions (protected)
- **GET** `/api/v1/submissions/:id` - Get submission by ID (protected)
- **POST** `/api/v1/submissions` - Create new submission (protected)
- **PATCH** `/api/v1/submissions/:id` - Update submission (protected)
- **DELETE** `/api/v1/submissions/:id` - Delete submission (protected)

## Grade Management Endpoints
- **GET** `/api/v1/course-grades` - Get all course grades (protected)
- **GET** `/api/v1/course-grades/:id` - Get course grade by ID (protected)
- **POST** `/api/v1/course-grades` - Create new course grade (protected)
- **PATCH** `/api/v1/course-grades/:id` - Update course grade (protected)
- **DELETE** `/api/v1/course-grades/:id` - Delete course grade (protected)

## Notes:
- **Protected endpoints** require a valid JWT token in the Authorization header as `Bearer <token>`
- **Global prefix**: All API endpoints are prefixed with `/api/v1`
- **Base URL**: `https://shanghairevolmsapi.up.railway.app`
- All endpoints return JSON responses
- The API uses Swagger documentation (available at `/api` when running)
- Database operations use Prisma ORM with PostgreSQL
- Password hashing is done using bcryptjs
- JWT tokens expire after 24 hours

## Frontend Integration:
These endpoints provide all the necessary data for a comprehensive Learning Management System frontend, including:
- User authentication and profile management
- Course enrollment and management
- Assignment submission and grading
- Progress tracking and feedback
- Dashboard with overview statistics
- Todo lists for pending tasks

## Testing Examples:

### 1. Test Basic Connectivity
```bash
GET https://shanghairevolmsapi.up.railway.app/api/v1/test
```

### 2. Register a User
```bash
POST https://shanghairevolmsapi.up.railway.app/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 3. Access Dashboard (with JWT token)
```bash
GET https://shanghairevolmsapi.up.railway.app/api/v1/dashboard
Authorization: Bearer <your-jwt-token>
```
