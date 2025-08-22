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
  @ApiOperation({ 
    summary: 'Get dashboard data for current user',
    description: 'Retrieve comprehensive dashboard information including enrollments, assignments, submissions, and grades for the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'object',
          properties: {
            totalCourses: { type: 'number', example: 3 },
            completedAssignments: { type: 'number', example: 15 },
            upcomingAssignments: { type: 'number', example: 5 }
          }
        },
        recentEnrollments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              course: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Introduction to Computer Science' },
                  code: { type: 'string', example: 'CS101' },
                  credits: { type: 'number', example: 3 }
                }
              }
            }
          }
        },
        recentAssignments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string', example: 'Programming Assignment 1' },
              course: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  code: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboardData(req.user.sub);
  }
}
