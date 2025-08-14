import { IsEmail, IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: ['STUDENT', 'TEACHER', 'ADMIN'], default: 'STUDENT' })
  @IsEnum(['STUDENT', 'TEACHER', 'ADMIN'])
  @IsOptional()
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT';
}
