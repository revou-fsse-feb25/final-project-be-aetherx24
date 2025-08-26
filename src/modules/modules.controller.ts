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
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('modules')
@Controller('modules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: 200, description: 'Modules retrieved successfully' })
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.modulesService.findByCourse(courseId);
    }
    return this.modulesService.findAll();
  }

  @Get('course/:courseId')
  @ApiOperation({ 
    summary: 'Get all modules for a specific course',
    description: 'Retrieves all modules for a given course with their lessons'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Course modules retrieved successfully',
    schema: {
      example: {
        course: {
          id: 'course_id',
          title: 'Introduction to Programming',
          code: 'CS101',
          description: 'Learn the basics of programming'
        },
        modules: [
          {
            id: 'module_id',
            title: 'Module 1: Basics',
            description: 'Introduction to programming concepts',
            order: 1,
            isActive: true,
            lessons: [
              {
                id: 'lesson_id',
                title: 'What is Programming?',
                content: 'Programming is...',
                order: 1,
                isActive: true
              }
            ]
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  getModulesByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.getModulesByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by id' })
  @ApiResponse({ status: 200, description: 'Module retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module' })
  @ApiResponse({ status: 200, description: 'Module updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module' })
  @ApiResponse({ status: 200, description: 'Module deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete module with lessons' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
