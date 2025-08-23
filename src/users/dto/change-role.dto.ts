import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleDto {
  @ApiProperty({ 
    enum: ['STUDENT', 'TEACHER', 'ADMIN'], 
    description: 'New role to assign to the user',
    example: 'TEACHER'
  })
  @IsEnum(['STUDENT', 'TEACHER', 'ADMIN'])
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';

  @ApiProperty({ 
    required: false,
    description: 'Reason for role change (optional)',
    example: 'Promoted to teacher due to qualifications'
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
