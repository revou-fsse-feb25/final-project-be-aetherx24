import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CourseGradesService } from './course-grades.service';
import { CreateCourseGradeDto } from './dto/create-course-grade.dto';
import { UpdateCourseGradeDto } from './dto/update-course-grade.dto';

@ApiTags('Course Grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('course-grades')
export class CourseGradesController {
  constructor(private readonly courseGradesService: CourseGradesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course grade' })
  @ApiResponse({ status: 201, description: 'Course grade created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createCourseGradeDto: CreateCourseGradeDto, @Request() req) {
    return this.courseGradesService.create(
      createCourseGradeDto,
      req.user.id,
      req.user.role,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all course grades (filtered by user role)' })
  @ApiResponse({ status: 200, description: 'Course grades retrieved successfully' })
  findAll(@Request() req) {
    return this.courseGradesService.findAll(req.user.id, req.user.role);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get course grades for a specific student' })
  @ApiResponse({ status: 200, description: 'Course grades retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findByStudent(@Param('studentId') studentId: string, @Request() req) {
    return this.courseGradesService.findByStudent(studentId, req.user.id, req.user.role);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get course grades for a specific course' })
  @ApiResponse({ status: 200, description: 'Course grades retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findByCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.courseGradesService.findByCourse(courseId, req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific course grade by ID' })
  @ApiResponse({ status: 200, description: 'Course grade retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course grade not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.courseGradesService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course grade' })
  @ApiResponse({ status: 200, description: 'Course grade updated successfully' })
  @ApiResponse({ status: 404, description: 'Course grade not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  update(
    @Param('id') id: string,
    @Body() updateCourseGradeDto: UpdateCourseGradeDto,
    @Request() req,
  ) {
    return this.courseGradesService.update(
      id,
      updateCourseGradeDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course grade' })
  @ApiResponse({ status: 200, description: 'Course grade deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course grade not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  remove(@Param('id') id: string, @Request() req) {
    return this.courseGradesService.remove(id, req.user.id, req.user.role);
  }
}
