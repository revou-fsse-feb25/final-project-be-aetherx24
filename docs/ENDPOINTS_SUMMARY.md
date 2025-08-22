# Backend API Endpoints Summary

## Authentication Endpoints
- **POST** `/auth/login` - User login
- **POST** `/auth/register` - User registration

## User Management Endpoints
- **GET** `/users/profile` - Get current user profile (protected)
- **GET** `/users` - Get all users (protected)
- **GET** `/users/:id` - Get user by ID (protected)
- **POST** `/users` - Create new user
- **PATCH** `/users/:id` - Update user (protected)
- **DELETE** `/users/:id` - Delete user (protected)

## Course Management Endpoints
- **GET** `/courses` - Get all courses (protected)
- **GET** `/courses/:id` - Get course by ID (protected)
- **POST** `/courses` - Create new course (protected)
- **PATCH** `/courses/:id` - Update course (protected)
- **DELETE** `/courses/:id` - Delete course (protected)

## Enrollment Endpoints
- **GET** `/enrollments/my-enrollments` - Get current user's enrollments (protected)
- **GET** `/enrollments` - Get all enrollments (protected)
- **GET** `/enrollments/student/:studentId` - Get enrollments for specific student (protected)
- **GET** `/enrollments/course/:courseId` - Get enrollments for specific course (protected)
- **GET** `/enrollments/:id` - Get enrollment by ID (protected)
- **POST** `/enrollments` - Create new enrollment (protected)
- **PATCH** `/enrollments/:id` - Update enrollment (protected)
- **DELETE** `/enrollments/:id` - Remove enrollment (protected)

## Dashboard Endpoints
- **GET** `/dashboard` - Get dashboard data for current user (protected)

## Todos Endpoints
- **GET** `/todos` - Get current user's todos (protected)

## Feedback Endpoints
- **GET** `/feedback/recent` - Get recent feedback for current user (protected)

## Module Management Endpoints
- **GET** `/modules` - Get all modules (protected)
- **GET** `/modules/:id` - Get module by ID (protected)
- **POST** `/modules` - Create new module (protected)
- **PATCH** `/modules/:id` - Update module (protected)
- **DELETE** `/modules/:id` - Delete module (protected)

## Lesson Management Endpoints
- **GET** `/lessons` - Get all lessons (protected)
- **GET** `/lessons/:id` - Get lesson by ID (protected)
- **POST** `/lessons` - Create new lesson (protected)
- **PATCH** `/lessons/:id` - Update lesson (protected)
- **DELETE** `/lessons/:id` - Delete lesson (protected)

## Assignment Management Endpoints
- **GET** `/assignments` - Get all assignments (protected)
- **GET** `/assignments/:id` - Get assignment by ID (protected)
- **POST** `/assignments` - Create new assignment (protected)
- **PATCH** `/assignments/:id` - Update assignment (protected)
- **DELETE** `/assignments/:id` - Delete assignment (protected)

## Submission Management Endpoints
- **GET** `/submissions` - Get all submissions (protected)
- **GET** `/submissions/:id` - Get submission by ID (protected)
- **POST** `/submissions` - Create new submission (protected)
- **PATCH** `/submissions/:id` - Update submission (protected)
- **DELETE** `/submissions/:id` - Delete submission (protected)

## Grade Management Endpoints
- **GET** `/course-grades` - Get all course grades (protected)
- **GET** `/course-grades/:id` - Get course grade by ID (protected)
- **POST** `/course-grades` - Create new course grade (protected)
- **PATCH** `/course-grades/:id` - Update course grade (protected)
- **DELETE** `/course-grades/:id` - Delete course grade (protected)

## Notes:
- **Protected endpoints** require a valid JWT token in the Authorization header as `Bearer <token>`
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
