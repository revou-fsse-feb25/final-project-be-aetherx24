import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user todos' })
  @ApiResponse({ status: 200, description: 'Return current user todos' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTodos(@Request() req) {
    return this.todosService.getUserTodos(req.user.sub);
  }
}
