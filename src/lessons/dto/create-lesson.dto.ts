import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ description: 'Lesson title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Lesson content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Lesson order within module' })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ description: 'Module ID this lesson belongs to' })
  @IsString()
  moduleId: string;

  @ApiPropertyOptional({ description: 'Whether the lesson is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
