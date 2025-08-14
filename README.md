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

# Learning Management System (LMS) Backend

A modern Learning Management System backend built with NestJS and Prisma, similar to Canvas and Moodle.

## 🚀 Features

- **User Management**: Students, Teachers, and Admins with role-based access
- **Course Management**: Create, update, and manage courses with modules and lessons
- **Enrollment System**: Track student enrollments in courses
- **Grading System**: Manage assignments, quizzes, exams, and calculate GPA
- **Authentication**: JWT-based authentication with secure password hashing
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: SQLite with Prisma ORM (easy to switch to PostgreSQL/MySQL)

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: SQLite (with Prisma ORM)
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Basic knowledge of REST APIs

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the configuration file and update it:

```bash
cp config.env .env
```

Edit `.env` file with your configuration:
```env
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

### 3. Set Up Database

Generate Prisma client and create database:
```bash
npm run db:generate
npm run db:push
```

### 4. Start the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000`
API Documentation: `http://localhost:3000/api`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - Get all users (protected)
- `GET /api/v1/users/:id` - Get user by ID (protected)
- `PATCH /api/v1/users/:id` - Update user (protected)
- `DELETE /api/v1/users/:id` - Delete user (protected)

### Courses
- `POST /api/v1/courses` - Create course (protected)
- `GET /api/v1/courses` - Get all active courses
- `GET /api/v1/courses/:id` - Get course with modules and lessons
- `PATCH /api/v1/courses/:id` - Update course (protected)
- `DELETE /api/v1/courses/:id` - Delete course (protected)

### Enrollments
- `POST /api/v1/enrollments` - Enroll student in course (protected)
- `GET /api/v1/enrollments` - Get all enrollments (protected)
- `GET /api/v1/enrollments/student/:studentId` - Get student enrollments (protected)
- `GET /api/v1/enrollments/course/:courseId` - Get course enrollments (protected)
- `PATCH /api/v1/enrollments/:id` - Update enrollment (protected)
- `DELETE /api/v1/enrollments/:id` - Remove enrollment (protected)

### Grades
- `POST /api/v1/grades` - Create grade (protected)
- `GET /api/v1/grades` - Get all grades (protected)
- `GET /api/v1/grades/student/:studentId` - Get student grades (protected)
- `GET /api/v1/grades/course/:courseId` - Get course grades (protected)
- `GET /api/v1/grades/student/:studentId/gpa` - Get student GPA (protected)
- `PATCH /api/v1/grades/:id` - Update grade (protected)
- `DELETE /api/v1/grades/:id` - Delete grade (protected)

## 🗄️ Database Schema

The system includes the following main entities:

- **Users**: Students, Teachers, Admins
- **Courses**: Course information with teacher assignment
- **Modules**: Course content organization
- **Lessons**: Individual lesson content within modules
- **Enrollments**: Student-course relationships
- **Grades**: Assignment/exam scores and GPA calculation

## 🔐 Authentication

The API uses JWT tokens for authentication. To access protected endpoints:

1. Login using `POST /api/v1/auth/login`
2. Include the returned token in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## 📖 Usage Examples

### 1. Create a Teacher Account
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TEACHER"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123"
  }'
```

### 3. Create a Course (with token)
```bash
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Computer Science",
    "description": "Learn the basics of programming",
    "code": "CS101",
    "credits": 3,
    "teacherId": "<teacher-user-id>"
  }'
```

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 Available Scripts

- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🔧 Configuration

### Database
The default configuration uses SQLite for simplicity. To use PostgreSQL or MySQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql" // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update your `.env` file with the new database URL

### JWT Configuration
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: Token expiration time (default: 24h)

## 🚀 Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Configure production database URL
- Set appropriate `PORT`

### Database
- Run `npm run db:migrate` to apply migrations
- Ensure database is accessible from your deployment environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the API documentation at `/api`
2. Review the console logs for error messages
3. Ensure all environment variables are set correctly
4. Verify database connectivity

## 🎯 Next Steps

This is a basic LMS backend. You can extend it with:

- File uploads for course materials
- Real-time notifications
- Discussion forums
- Video conferencing integration
- Advanced analytics and reporting
- Mobile app support
- Multi-tenancy for different institutions
