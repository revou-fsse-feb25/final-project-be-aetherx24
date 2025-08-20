import { PartialType } from '@nestjs/swagger';
import { CreateCourseGradeDto } from './create-course-grade.dto';

export class UpdateCourseGradeDto extends PartialType(CreateCourseGradeDto) {}
