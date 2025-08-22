# Documentation

This folder contains the documentation for the Learning Management System (LMS) Backend API.

## Contents

- **[API Endpoints Summary](./ENDPOINTS_SUMMARY.md)** - Complete list of all available API endpoints with descriptions
- **Future documentation files will be added here**

## API Overview

The LMS Backend API is built with NestJS and provides a comprehensive set of endpoints for:

- **Authentication & Authorization** - User login, registration, and JWT-based security
- **User Management** - User profiles, roles, and permissions
- **Course Management** - Course creation, enrollment, and administration
- **Content Management** - Modules, lessons, and assignments
- **Assessment & Grading** - Submissions, grades, and feedback
- **Dashboard & Analytics** - User progress tracking and statistics

## Getting Started

1. **Setup** - Follow the main project README for installation and setup
2. **Authentication** - Start with `/auth/register` or `/auth/login` endpoints
3. **API Documentation** - Access Swagger docs at `/api` when running the application
4. **Testing** - Use the provided endpoints with proper JWT authentication

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: Class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs for password hashing

## Contributing

When adding new endpoints or features, please update the relevant documentation files in this folder.
