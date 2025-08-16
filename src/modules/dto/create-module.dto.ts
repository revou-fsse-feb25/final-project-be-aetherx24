import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ description: 'Module title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Module description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Module order within course' })
  @IsInt()
  @Min(1)
  order: number;

  @ApiPropertyOptional({ description: 'Course ID this module belongs to' })
  @IsString()
  courseId: string;

  @ApiPropertyOptional({ description: 'Whether the module is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
