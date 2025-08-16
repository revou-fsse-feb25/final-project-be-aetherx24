import { IsString, IsOptional, IsFloat, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ description: 'Submission content (text, file path, etc.)' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Assignment ID this submission is for' })
  @IsString()
  assignmentId: string;

  @ApiProperty({ description: 'Student ID submitting the assignment' })
  @IsString()
  studentId: string;
}

export class GradeSubmissionDto {
  @ApiProperty({ description: 'Score given to the submission' })
  @IsFloat()
  @Min(0)
  score: number;

  @ApiPropertyOptional({ description: 'Feedback for the student' })
  @IsOptional()
  @IsString()
  feedback?: string;
}
