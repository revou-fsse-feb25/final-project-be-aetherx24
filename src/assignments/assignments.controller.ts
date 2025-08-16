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

@ApiTags('assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully' })
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.assignmentsService.findByCourse(courseId);
    }
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assignment by id' })
  @ApiResponse({ status: 200, description: 'Assignment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete assignment with submissions' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
