import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 'student-id-here' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: 'course-id-here' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ enum: ['ACTIVE', 'COMPLETED', 'DROPPED', 'PENDING'], default: 'ACTIVE' })
  @IsEnum(['ACTIVE', 'COMPLETED', 'DROPPED', 'PENDING'])
  @IsOptional()
  status?: 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'PENDING' = 'ACTIVE';
}
