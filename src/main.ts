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
      'shanghairevolmsapi.up.railway.app',
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
      
      ## Overview
      This API provides comprehensive endpoints for managing a Learning Management System including:
      - User authentication and management
      - Course and content management
      - Student enrollment and progress tracking
      - Assignment submission and grading
      - Dashboard and analytics
      
      ## Base URL
      All endpoints are prefixed with \`/api/v1\`
      
      ## Authentication
      Most endpoints require JWT authentication. Include your token in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
      
      ## Getting Started
      1. Register a user: \`POST /api/v1/auth/register\`
      2. Login: \`POST /api/v1/auth/login\`
      3. Use the returned JWT token for authenticated requests
      
      ## Rate Limiting
      API requests are limited to prevent abuse. Please implement appropriate caching in your frontend.
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
    .addTag('Authentication', 'User login, registration, and JWT management')
    .addTag('Users', 'User profile and management operations')
    .addTag('Courses', 'Course creation, management, and administration')
    .addTag('Dashboard', 'User dashboard with comprehensive data')
    .addTag('Todos', 'User task management and pending items')
    .addTag('Feedback', 'Assignment feedback and grading information')
    .addTag('Enrollments', 'Student course enrollment management')
    .addTag('Assignments', 'Course assignment creation and management')
    .addTag('Submissions', 'Student assignment submissions')
    .addTag('Grades', 'Grading system and performance tracking')
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
