import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new course',
    description: 'Create a new course with title, description, code, and credits. Only teachers and admins can create courses. Each course must have a unique code (e.g., CS101, WD201).'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Course created successfully',
    schema: {
      example: {
        id: 'course_id_here',
        title: 'Advanced Web Development',
        description: 'Learn modern web development techniques including React, Node.js, and databases',
        code: 'WD201',
        credits: 4,
        isActive: true,
        teacherId: 'teacher_id_here',
        teacher: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@lms.com'
        },
        createdAt: '2025-08-22T10:00:00.000Z',
        updatedAt: '2025-08-22T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid course data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only teachers and admins can create courses' })
  @ApiResponse({ status: 409, description: 'Conflict - Course with this code already exists' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active courses' })
  @ApiResponse({ status: 200, description: 'Return all active courses' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a course by ID',
    description: 'Retrieve a specific course with all its details including modules, lessons, assignments, enrollments, and teacher information. This provides a complete view of the course structure and content.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Course retrieved successfully with complete structure',
    schema: {
      example: {
        id: 'course_id_here',
        title: 'Advanced Web Development',
        description: 'Learn modern web development techniques including React, Node.js, and databases',
        code: 'WD201',
        credits: 4,
        isActive: true,
        teacherId: 'teacher_id_here',
        teacher: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@lms.com'
        },
        modules: [
          {
            id: 'module_id_here',
            title: 'Frontend Development',
            description: 'Learn React and modern JavaScript',
            order: 1,
            lessons: [
              {
                id: 'lesson_id_here',
                title: 'Introduction to React',
                content: 'React is a JavaScript library for building user interfaces...',
                order: 1
              }
            ],
            assignments: [
              {
                id: 'assignment_id_here',
                title: 'React Component Project',
                description: 'Build a simple React component',
                maxScore: 100,
                dueDate: '2025-09-15T23:59:59.000Z',
                type: 'PROJECT'
              }
            ]
          }
        ],
        enrollments: [
          {
            id: 'enrollment_id_here',
            student: {
              firstName: 'Alice',
              lastName: 'Johnson',
              email: 'alice@lms.com'
            },
            status: 'ACTIVE',
            enrolledAt: '2025-08-20T10:00:00.000Z'
          }
        ],
        createdAt: '2025-08-22T10:00:00.000Z',
        updatedAt: '2025-08-22T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
