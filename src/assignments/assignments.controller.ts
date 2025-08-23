import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new assignment',
    description: 'Create a new assignment for a specific course. Teachers can create assignments with various types (HOMEWORK, QUIZ, EXAM, PROJECT) and set due dates, maximum scores, and detailed descriptions.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Assignment created successfully',
    schema: {
      example: {
        id: 'assignment_id_here',
        title: 'Final Project',
        description: 'Build a full-stack application',
        maxScore: 100,
        dueDate: '2025-12-15T23:59:59.000Z',
        type: 'PROJECT',
        isActive: true,
        courseId: 'course_id_here',
        moduleId: 'module_id_here',
        createdAt: '2025-08-22T10:00:00.000Z',
        updatedAt: '2025-08-22T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid assignment data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only teachers can create assignments' })
  @ApiResponse({ status: 404, description: 'Course or module not found' })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all assignments',
    description: 'Retrieve all assignments. Optionally filter by courseId query parameter to get assignments for a specific course. Supports pagination and filtering.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Assignments retrieved successfully',
    schema: {
      example: [
        {
          id: 'assignment_id_here',
          title: 'Programming Assignment 1',
          description: 'Write a simple calculator program',
          maxScore: 100,
          dueDate: '2025-09-30T23:59:59.000Z',
          type: 'HOMEWORK',
          isActive: true,
          courseId: 'course_id_here',
          moduleId: 'module_id_here',
          createdAt: '2025-08-22T10:00:00.000Z',
          updatedAt: '2025-08-22T10:00:00.000Z'
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.assignmentsService.findByCourse(courseId);
    }
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get an assignment by ID',
    description: 'Retrieve a specific assignment by its unique identifier. Returns detailed assignment information including course and module details.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Assignment retrieved successfully',
    schema: {
      example: {
        id: 'assignment_id_here',
        title: 'Final Project',
        description: 'Build a full-stack application',
        maxScore: 100,
        dueDate: '2025-12-15T23:59:59.000Z',
        type: 'PROJECT',
        isActive: true,
        courseId: 'course_id_here',
        moduleId: 'module_id_here',
        course: {
          title: 'Web Development',
          code: 'WD101'
        },
        module: {
          title: 'Advanced Concepts',
          order: 3
        },
        createdAt: '2025-08-22T10:00:00.000Z',
        updatedAt: '2025-08-22T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update an assignment',
    description: 'Update an existing assignment. Teachers can modify assignment details, due dates, scores, and descriptions. Cannot update assignments that already have student submissions.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Assignment updated successfully',
    schema: {
      example: {
        id: 'assignment_id_here',
        title: 'Updated Final Project',
        description: 'Build a full-stack application with additional requirements',
        maxScore: 150,
        dueDate: '2025-12-20T23:59:59.000Z',
        type: 'PROJECT',
        isActive: true,
        courseId: 'course_id_here',
        moduleId: 'module_id_here',
        createdAt: '2025-08-22T10:00:00.000Z',
        updatedAt: '2025-08-22T15:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid update data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only assignment creator can update' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Cannot update assignment with existing submissions' })
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete an assignment',
    description: 'Permanently delete an assignment. This action cannot be undone. Assignments with existing student submissions cannot be deleted to preserve academic integrity.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Assignment deleted successfully',
    schema: {
      example: {
        message: 'Assignment deleted successfully',
        deletedAssignment: {
          id: 'assignment_id_here',
          title: 'Test Assignment',
          deletedAt: '2025-08-22T16:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Cannot delete assignment with submissions' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only assignment creator can delete' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Assignment has existing submissions' })
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
