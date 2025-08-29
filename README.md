<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# LMS Backend - Learning Management System

## 🌱 Getting Started with Sample Data

This project includes comprehensive seed data to get you up and running quickly. The seed script creates a complete LMS environment with users, courses, modules, lessons, assignments, and sample submissions.

### 🚀 Quick Setup

```bash
# Install dependencies
npm install

# Set up your database (configure .env first)
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### 📋 What You Get

- **👥 Users**: Admin, Teachers, and Students with test credentials
- **📚 Courses**: Computer Science (CS101) and Web Development (WD101)
- **📖 Content**: Modules, lessons, and assignments
- **📊 Data**: Sample submissions, grades, and enrollments

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@lms.com` | `admin123` |
| Teacher 1 | `teacher1@lms.com` | `teacher123` |
| Teacher 2 | `teacher2@lms.com` | `teacher123` |
| Student 1 | `student1@lms.com` | `student123` |
| Student 2 | `student2@lms.com` | `student123` |

### 📚 Detailed Documentation

For complete information about the seed data, including:
- Course structures and content
- Assignment types and due dates
- Data relationships and customization
- Development workflow tips

**See: [prisma/README.md](prisma/README.md)**

---

A robust, scalable backend for a Learning Management System built with NestJS, Prisma, and PostgreSQL.

## 🚀 Features

### Core Functionality
- **User Management**: Students, Teachers, and Admins with role-based access
- **Course Management**: Create, update, and manage courses with modules and lessons
- **Content Organization**: Hierarchical structure with courses → modules → lessons
- **Assignment System**: Create assignments, accept submissions, and grade them
- **Enrollment Management**: Student course enrollment and progress tracking
- **Grading System**: Comprehensive grading with feedback and analytics

### Technical Features
- **RESTful API**: Well-structured endpoints with proper HTTP methods
- **Authentication**: JWT-based authentication with Passport.js
- **Validation**: Comprehensive input validation with class-validator
- **Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Security**: Role-based access control and proper authorization

## 🏗️ Architecture

```
src/
├── auth/           # Authentication & Authorization
├── users/          # User management
├── courses/        # Course management
├── modules/        # Course modules
├── lessons/        # Individual lessons
├── assignments/    # Course assignments
├── submissions/    # Student submissions
├── enrollments/    # Student enrollments
├── grades/         # Grading system
└── prisma/         # Database layer
```

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 📖 Documentation

- **[API Endpoints](./docs/ENDPOINTS_SUMMARY.md)** - Complete API reference
- **[Project Documentation](./docs/)** - Additional documentation and guides

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd lms-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/lms_database"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 5. Start the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000/api/v1`
API documentation will be available at `http://localhost:3000/api` (Swagger UI)

## 📚 API Endpoints

For a complete and detailed list of all available API endpoints, please see the [API Documentation](./docs/ENDPOINTS_SUMMARY.md).

### Quick Overview
- **Authentication**: Login, registration, and JWT management
- **User Management**: CRUD operations for users with role-based access
- **Course Management**: Complete course lifecycle management
- **Content Management**: Modules, lessons, and assignments
- **Assessment System**: Submissions, grading, and feedback
- **Enrollment System**: Student course enrollment and tracking
- **Dashboard & Analytics**: User progress and system statistics

### New Frontend-Ready Endpoints
- `GET /dashboard` - User dashboard with comprehensive data
- `GET /users/profile` - Current user profile information
- `GET /enrollments/my-enrollments` - User's course enrollments
- `GET /todos` - User's pending tasks and assignments
- `GET /feedback/recent` - Recent feedback and grades

## 🔐 Authentication & Authorization

All endpoints (except login/register) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access Control
- **STUDENT**: Can view courses, submit assignments, view grades
- **TEACHER**: Can manage courses, create assignments, grade submissions
- **ADMIN**: Full access to all resources

## 🗄️ Database Schema

The system uses a relational database with the following key entities:

- **Users**: Students, teachers, and admins
- **Courses**: Educational courses with metadata
- **Modules**: Course sections containing lessons
- **Lessons**: Individual learning units
- **Assignments**: Course tasks and assessments
- **Submissions**: Student assignment submissions
- **Enrollments**: Student-course relationships
- **Grades**: Assessment results and feedback

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Development

### Available Scripts
- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style
The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- NestJS best practices

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Environment Variables
Make sure to set proper environment variables for production:
- Strong JWT secret
- Production database URL
- Proper NODE_ENV

### Docker (Optional)
You can containerize the application using Docker for easier deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api`
- Review the codebase structure
- Open an issue on GitHub

## 🔮 Future Enhancements

- File upload support for assignments
- Real-time notifications
- Advanced analytics and reporting
- Integration with external LMS standards
- Mobile app support
- Video conferencing integration
- Advanced search and filtering
- Bulk operations for teachers
- Student progress tracking
- Course completion certificates
#   T r i g g e r   d e p l o y m e n t 
 
 