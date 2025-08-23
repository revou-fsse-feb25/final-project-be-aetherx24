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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, GradeSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@ApiTags('Submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Submit an assignment',
    description: 'Submit an assignment for grading. Students can submit assignments they are enrolled in. Each student can only submit once per assignment. Submissions include content (text, file paths, or links) and are timestamped.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Submission created successfully',
    schema: {
      example: {
        id: 'submission_id_here',
        content: 'I completed the programming assignment with the following features...',
        score: null,
        feedback: null,
        submittedAt: '2025-08-22T14:30:00.000Z',
        gradedAt: null,
        studentId: 'student_id_here',
        assignmentId: 'assignment_id_here',
        createdAt: '2025-08-22T14:30:00.000Z',
        updatedAt: '2025-08-22T14:30:00.000Z',
        assignment: {
          title: 'Programming Assignment 1',
          maxScore: 100
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid submission data or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student not enrolled in course or already submitted' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Student has already submitted this assignment' })
  create(@Body() createSubmissionDto: CreateSubmissionDto, @Request() req) {
    return this.submissionsService.create(createSubmissionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiResponse({ status: 200, description: 'Submissions retrieved successfully' })
  findAll(@Query('assignmentId') assignmentId?: string, @Query('studentId') studentId?: string) {
    if (assignmentId) {
      return this.submissionsService.findByAssignment(assignmentId);
    }
    if (studentId) {
      return this.submissionsService.findByStudent(studentId);
    }
    return this.submissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a submission by id' })
  @ApiResponse({ status: 200, description: 'Submission retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a submission' })
  @ApiResponse({ status: 200, description: 'Submission updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only update own submissions' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  update(@Param('id') id: string, @Body() updateSubmissionDto: UpdateSubmissionDto, @Request() req) {
    return this.submissionsService.update(id, updateSubmissionDto, req.user.id);
  }

  @Post(':id/grade')
  @ApiOperation({ 
    summary: 'Grade a submission (Teachers only)',
    description: 'Grade a student submission with score, feedback, and comments. Only teachers of the course can grade submissions. This creates an assignment grade record and updates the submission with grading information.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Submission graded successfully',
    schema: {
      example: {
        message: 'Submission graded successfully',
        submission: {
          id: 'submission_id_here',
          content: 'I completed the programming assignment...',
          score: 85,
          feedback: 'Good work! Consider adding more error handling.',
          submittedAt: '2025-08-22T14:30:00.000Z',
          gradedAt: '2025-08-22T16:00:00.000Z',
          studentId: 'student_id_here',
          assignmentId: 'assignment_id_here',
          assignment: {
            title: 'Programming Assignment 1',
            maxScore: 100
          }
        },
        assignmentGrade: {
          id: 'grade_id_here',
          score: 85,
          maxScore: 100,
          percentage: 85.0,
          feedback: 'Good work! Consider adding more error handling.',
          gradedBy: 'teacher_id_here',
          gradedAt: '2025-08-22T16:00:00.000Z',
          studentId: 'student_id_here',
          assignmentId: 'assignment_id_here',
          courseId: 'course_id_here'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid grade data or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only course teacher can grade submissions' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Submission already graded' })
  grade(@Param('id') id: string, @Body() gradeSubmissionDto: GradeSubmissionDto, @Request() req) {
    return this.submissionsService.grade(id, gradeSubmissionDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiResponse({ status: 200, description: 'Submission deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only delete own submissions' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.submissionsService.remove(id, req.user.id);
  }
}
