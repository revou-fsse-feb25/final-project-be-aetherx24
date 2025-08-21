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
  app.enableCors();
  console.log('✅ CORS enabled');

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  console.log('✅ Validation pipe configured');

  // Swagger API documentation setup
  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('Learning Management System API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('✅ Swagger configured');

  // Global prefix for API routes (excluding root and health)
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'health'],
  });
  console.log('✅ Global prefix configured');

  const port = process.env.PORT || 8008;
  console.log(`🌐 Attempting to bind to port ${port} on 0.0.0.0...`);
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 LMS Backend is running on: http://0.0.0.0:${port}`);
  console.log(`📚 API Documentation available at: http://0.0.0.0:${port}/api`);
  console.log('✅ Application started successfully!');
}

bootstrap();
