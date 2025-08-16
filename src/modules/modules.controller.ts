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
