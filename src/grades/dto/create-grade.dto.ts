import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({ example: 85.5, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({ example: 100, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  maxScore: number;

  @ApiProperty({ enum: ['ASSIGNMENT', 'QUIZ', 'EXAM', 'PROJECT', 'PARTICIPATION'] })
  @IsEnum(['ASSIGNMENT', 'QUIZ', 'EXAM', 'PROJECT', 'PARTICIPATION'])
  type: 'ASSIGNMENT' | 'QUIZ' | 'EXAM' | 'PROJECT' | 'PARTICIPATION';

  @ApiProperty({ example: 'Midterm Exam' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Covers chapters 1-5' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-12-15T23:59:59.000Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'student-id-here' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: 'course-id-here' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
