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

@ApiTags('submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an assignment' })
  @ApiResponse({ status: 201, description: 'Submission created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - not enrolled or already submitted' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
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
  @ApiOperation({ summary: 'Grade a submission (teachers only)' })
  @ApiResponse({ status: 200, description: 'Submission graded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - only course teacher can grade' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
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
