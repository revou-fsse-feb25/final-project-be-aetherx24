import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard data for current user' })
  @ApiResponse({ status: 200, description: 'Return dashboard data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboardData(req.user.sub);
  }
}
