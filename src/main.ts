import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Starting LMS Backend...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Port:', process.env.PORT || 8008);
  
  const app = await NestFactory.create(AppModule);
  console.log('✅ NestJS app created successfully');

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'https://final-project-fe-aetherx24-production.up.railway.app',
      'https://shanghairevolmsapi.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  console.log('✅ CORS configured with specific origins');

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  console.log('✅ Validation pipe configured');

  // Global prefix for API routes (excluding root and health)
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'health'],
  });
  console.log('✅ Global prefix configured');

  // Swagger API documentation setup - AFTER global prefix is set
  const config = new DocumentBuilder()
    .setTitle('LMS API - Learning Management System')
    .setDescription(`
      # Learning Management System API Documentation
      
      ## 🚀 Overview
      This API provides comprehensive endpoints for managing a Learning Management System including:
      
      ### 🔐 Authentication & User Management
      - User registration, login, and JWT token management
      - Role-based access control (STUDENT, TEACHER, ADMIN)
      - User profile management and role assignment
      
      ### 📚 Course & Content Management
      - Course creation, editing, and administration
      - Module and lesson organization within courses
      - Course enrollment and student management
      
      ### 📝 Assignment & Submission System
      - Assignment creation and management by teachers
      - Student assignment submissions
      - Comprehensive grading system with feedback
      
      ### 📊 Performance Tracking & Analytics
      - Role-based dashboards (Student, Teacher, Admin)
      - Grade tracking and performance analytics
      - Course progress monitoring
      
      ### 🎯 Additional Features
      - Todo management and task tracking
      - Feedback and communication system
      - System health monitoring (Admin only)
      
      ## 🌐 Base URL
      All endpoints are prefixed with \`/api/v1\`
      
      ## 🔑 Authentication
      Most endpoints require JWT authentication. Include your token in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
      
      ## 🚦 Getting Started
      1. **Register a user**: \`POST /api/v1/auth/register\`
      2. **Login**: \`POST /api/v1/auth/login\`
      3. **Use the returned JWT token** for authenticated requests
      4. **Access role-based dashboard**: \`GET /api/v1/dashboard\`
      
      ## 📋 API Structure
      - **Authentication**: \`/api/v1/auth/*\` - Login, register, token refresh
      - **Users**: \`/api/v1/users/*\` - User management and profiles
      - **Courses**: \`/api/v1/courses/*\` - Course CRUD operations
      - **Modules**: \`/api/v1/modules/*\` - Course module management
      - **Lessons**: \`/api/v1/lessons/*\` - Lesson content management
      - **Assignments**: \`/api/v1/assignments/*\` - Assignment creation and management
      - **Submissions**: \`/api/v1/submissions/*\` - Student submissions and grading
      - **Grades**: \`/api/v1/assignment-grades/*\` & \`/api/v1/course-grades/*\` - Performance tracking
      - **Enrollments**: \`/api/v1/enrollments/*\` - Student course enrollment
      - **Dashboard**: \`/api/v1/dashboard\` - Role-based data aggregation
      - **Todos**: \`/api/v1/todos\` - Task management
      - **Feedback**: \`/api/v1/feedback/*\` - Assignment feedback system
      
      ## 🔒 Role-Based Access
      - **STUDENT**: Access to enrolled courses, assignments, submissions, grades
      - **TEACHER**: Course management, assignment creation, grading, student analytics
      - **ADMIN**: System-wide management, user administration, performance monitoring
      
      ## 📊 Response Formats
      All endpoints return consistent JSON responses with:
      - Success/error status indicators
      - Descriptive messages
      - Structured data payloads
      - Timestamp information
      
      ## 🚨 Rate Limiting
      API requests are limited to prevent abuse. Please implement appropriate caching in your frontend.
      
      ## 🧪 Testing
      Use the interactive Swagger UI below to test all endpoints with real data.
    `)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .addServer('https://shanghairevolmsapi.up.railway.app', 'Production Server')
    .addServer('http://localhost:3000', 'Local Development')
    .addTag('Authentication', '🔐 User login, registration, and JWT token management')
    .addTag('Users', '👥 User profile management and role-based operations')
    .addTag('Courses', '📚 Course creation, management, and content organization')
    .addTag('Modules', '📖 Course module management and organization')
    .addTag('Lessons', '📝 Individual lesson content and management')
    .addTag('Assignments', '📋 Course assignment creation, management, and configuration')
    .addTag('Submissions', '📤 Student assignment submissions and content management')
    .addTag('Assignment Grades', '📊 Individual assignment grading and feedback system')
    .addTag('Course Grades', '🎯 Overall course performance and grade tracking')
    .addTag('Enrollments', '🎓 Student course enrollment and status management')
    .addTag('Dashboard', '📈 Role-based dashboards with comprehensive analytics')
    .addTag('Todos', '✅ Task management and pending item tracking')
    .addTag('Feedback', '💬 Assignment feedback and communication system')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Configure Swagger with better options
  const options = {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customSiteTitle: 'LMS API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em; }
      .swagger-ui .info .description { font-size: 1.1em; }
    `,
  };
  
  SwaggerModule.setup('api', app, document, options);
  console.log('✅ Swagger configured with global prefix and comprehensive documentation');
  console.log('✅ Swagger documentation available at /api');

  const port = process.env.PORT || 3000;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  console.log(`🌐 Attempting to bind to port ${port} on ${host}...`);
  await app.listen(port, host);
  
  console.log(`🚀 LMS Backend is running on: http://${host}:${port}`);
  console.log(`📚 API Documentation available at: http://${host}:${port}/api`);
  console.log('✅ Application started successfully!');
}

bootstrap();
