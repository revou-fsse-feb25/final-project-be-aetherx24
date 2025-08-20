import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseGradeDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Course ID' })
  @IsString()
  courseId: string;

  @ApiProperty({ description: 'Letter grade (A, B, C, D, F)' })
  @IsString()
  letterGrade: string;

  @ApiProperty({ description: 'Percentage score (0.0 to 100.0)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiPropertyOptional({ description: 'Teacher/admin comments' })
  @IsOptional()
  @IsString()
  comments?: string;
}
