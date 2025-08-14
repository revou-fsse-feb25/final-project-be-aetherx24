import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Computer Science' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn the basics of computer science and programming' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'CS101' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 3, minimum: 1, maximum: 6 })
  @IsInt()
  @Min(1)
  @Max(6)
  @IsOptional()
  credits?: number = 3;

  @ApiProperty({ example: 'teacher-id-here' })
  @IsString()
  @IsNotEmpty()
  teacherId: string;
}
