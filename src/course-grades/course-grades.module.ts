import { Module } from '@nestjs/common';
import { CourseGradesService } from './course-grades.service';
import { CourseGradesController } from './course-grades.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseGradesController],
  providers: [CourseGradesService],
  exports: [CourseGradesService],
})
export class CourseGradesModule {}
