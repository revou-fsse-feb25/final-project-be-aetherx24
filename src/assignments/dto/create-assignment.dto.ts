import { IsString, IsOptional, IsDateString, IsNumber, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'Assignment title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Assignment description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Course ID this assignment belongs to' })
  @IsString()
  courseId: string;

  @ApiPropertyOptional({ description: 'Module ID this assignment belongs to' })
  @IsOptional()
  @IsString()
  moduleId?: string;

  @ApiProperty({ description: 'Maximum possible score' })
  @IsNumber()
  @Min(0)
  maxScore: number;

  @ApiPropertyOptional({ description: 'Due date for the assignment' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Whether the assignment is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Assignment type (e.g., "HOMEWORK", "QUIZ", "EXAM")' })
  @IsOptional()
  @IsString()
  type?: string;
}
