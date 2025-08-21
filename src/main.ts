import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger API documentation setup
  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('Learning Management System API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global prefix for API routes (excluding root and health)
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'health'],
  });

  const port = process.env.PORT || 8008;
  await app.listen(port);
  
  console.log(`🚀 LMS Backend is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
}

bootstrap();
