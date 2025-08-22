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
    description: 'Role-based dashboard data retrieved successfully. Returns different data based on user role (STUDENT, TEACHER, or ADMIN)',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'STUDENT_DASHBOARD' },
            summary: {
              type: 'object',
              properties: {
                totalCourses: { type: 'number', example: 3 },
                completedAssignments: { type: 'number', example: 15 },
                upcomingAssignments: { type: 'number', example: 5 },
                averageGrade: { type: 'number', example: 87.5 }
              }
            },
            recentEnrollments: { type: 'array' },
            recentAssignments: { type: 'array' },
            recentSubmissions: { type: 'array' },
            recentGrades: { type: 'array' }
          }
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'TEACHER_DASHBOARD' },
            summary: {
              type: 'object',
              properties: {
                totalCourses: { type: 'number', example: 2 },
                totalStudents: { type: 'number', example: 45 },
                totalAssignments: { type: 'number', example: 8 },
                pendingSubmissions: { type: 'number', example: 12 },
                averageClassSize: { type: 'number', example: 22.5 }
              }
            },
            courses: { type: 'array' },
            pendingSubmissions: { type: 'array' },
            recentGrades: { type: 'array' },
            upcomingDueDates: { type: 'array' }
          }
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'ADMIN_DASHBOARD' },
            summary: {
              type: 'object',
              properties: {
                totalUsers: { type: 'number', example: 150 },
                totalCourses: { type: 'number', example: 12 },
                totalEnrollments: { type: 'number', example: 450 },
                pendingApprovals: { type: 'number', example: 5 }
              }
            },
            recentUsers: { type: 'array' },
            recentCourses: { type: 'array' },
            systemHealth: { type: 'object' }
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  getDashboard(@Request() req) {
    console.log(`🔍 Dashboard Controller: req.user.sub=${req.user.sub}, req.user.role=${req.user.role}`);
    console.log(`🔍 Dashboard Controller: Full req.user=`, JSON.stringify(req.user, null, 2));
    return this.dashboardService.getDashboardData(req.user.sub, req.user.role);
  }
}
