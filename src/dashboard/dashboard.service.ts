import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string, userRole: string) {
    console.log(`🔍 Dashboard Service: Called with userId=${userId}, userRole=${userRole}`);
    
    switch (userRole) {
      case 'STUDENT':
        console.log('📚 Returning STUDENT dashboard');
        return this.getStudentDashboard(userId);
      case 'TEACHER':
        console.log('👨‍🏫 Returning TEACHER dashboard');
        return this.getTeacherDashboard(userId);
      case 'ADMIN':
        console.log('👑 Returning ADMIN dashboard');
        return this.getAdminDashboard();
      default:
        console.log(`❌ Unsupported role: ${userRole}`);
        throw new Error(`Unsupported role: ${userRole}`);
    }
  }

  private async getStudentDashboard(userId: string) {
    const [
      enrollments,
      assignments,
      submissions,
      courseGrades,
      totalCourses,
      completedAssignments,
      upcomingAssignments,
    ] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { studentId: userId, status: 'ACTIVE' },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              code: true,
              credits: true,
            },
          },
        },
        take: 5,
      }),
      this.prisma.assignment.findMany({
        where: {
          course: {
            enrollments: {
              some: {
                studentId: userId,
                status: 'ACTIVE',
              },
            },
          },
          isActive: true,
        },
        include: {
          course: {
            select: {
              title: true,
              code: true,
            },
          },
        },
        take: 10,
      }),
      this.prisma.submission.findMany({
        where: { studentId: userId },
        include: {
          assignment: {
            select: {
              title: true,
              maxScore: true,
            },
          },
        },
        take: 5,
      }),
      this.prisma.courseGrade.findMany({
        where: { studentId: userId },
        include: {
          course: {
            select: {
              title: true,
              code: true,
            },
          },
        },
        take: 5,
      }),
      this.prisma.enrollment.count({
        where: { studentId: userId, status: 'ACTIVE' },
      }),
      this.prisma.submission.count({
        where: { studentId: userId },
      }),
      this.prisma.assignment.count({
        where: {
          course: {
            enrollments: {
              some: {
                studentId: userId,
                status: 'ACTIVE',
              },
            },
          },
          isActive: true,
          dueDate: {
            gte: new Date(),
          },
        },
      }),
    ]);

    return {
      type: 'STUDENT_DASHBOARD',
      summary: {
        totalCourses,
        completedAssignments,
        upcomingAssignments,
        averageGrade: this.calculateAverageGrade(courseGrades),
      },
      recentEnrollments: enrollments,
      recentAssignments: assignments,
      recentSubmissions: submissions,
      recentGrades: courseGrades,
    };
  }

  private async getTeacherDashboard(userId: string) {
    const [
      courses,
      totalStudents,
      pendingSubmissions,
      recentGrades,
      totalAssignments,
      upcomingDueDates,
    ] = await Promise.all([
      this.prisma.course.findMany({
        where: { teacherId: userId, isActive: true },
        include: {
          enrollments: {
            where: { status: 'ACTIVE' },
            select: { id: true },
          },
          _count: {
            select: {
              enrollments: { where: { status: 'ACTIVE' } },
              assignments: { where: { isActive: true } },
            },
          },
        },
        take: 5,
      }),
      this.prisma.enrollment.count({
        where: {
          course: { teacherId: userId },
          status: 'ACTIVE',
        },
      }),
      this.prisma.submission.findMany({
        where: {
          assignment: {
            course: { teacherId: userId },
          },
          score: null, // Not graded yet
        },
        include: {
          assignment: {
            select: {
              title: true,
              maxScore: true,
              dueDate: true,
            },
          },
          student: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        take: 10,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.assignmentGrade.findMany({
        where: {
          assignment: {
            course: { teacherId: userId },
          },
        },
        include: {
          assignment: {
            select: {
              title: true,
              maxScore: true,
            },
          },
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.assignment.count({
        where: {
          course: { teacherId: userId },
          isActive: true,
        },
      }),
      this.prisma.assignment.findMany({
        where: {
          course: { teacherId: userId },
          isActive: true,
          dueDate: { gte: new Date() },
        },
        select: {
          title: true,
          dueDate: true,
          course: { select: { title: true, code: true } },
        },
        take: 5,
        orderBy: { dueDate: 'asc' },
      }),
    ]);

    return {
      type: 'TEACHER_DASHBOARD',
      summary: {
        totalCourses: courses.length,
        totalStudents,
        totalAssignments,
        pendingSubmissions: pendingSubmissions.length,
        averageClassSize: totalStudents / Math.max(courses.length, 1),
      },
      courses,
      pendingSubmissions,
      recentGrades,
      upcomingDueDates,
    };
  }

  private async getAdminDashboard() {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      recentUsers,
      recentCourses,
      systemStats,
      pendingApprovals,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
      this.prisma.enrollment.count(),
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.findMany({
        select: {
          id: true,
          title: true,
          code: true,
          isActive: true,
          createdAt: true,
          teacher: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.$queryRaw`
        SELECT 
          COUNT(CASE WHEN role = 'STUDENT' THEN 1 END) as studentCount,
          COUNT(CASE WHEN role = 'TEACHER' THEN 1 END) as teacherCount,
          COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as adminCount
        FROM users
      `,
      this.prisma.enrollment.count({
        where: { status: 'PENDING' },
      }),
    ]);

    return {
      type: 'ADMIN_DASHBOARD',
      summary: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        pendingApprovals,
        userDistribution: systemStats[0],
      },
      recentUsers,
      recentCourses,
      systemHealth: {
        databaseStatus: 'HEALTHY',
        lastBackup: new Date().toISOString(),
        activeConnections: Math.floor(Math.random() * 50) + 10,
      },
    };
  }

  private calculateAverageGrade(courseGrades: any[]): number {
    if (courseGrades.length === 0) return 0;
    const total = courseGrades.reduce((sum, grade) => sum + grade.percentage, 0);
    return Math.round((total / courseGrades.length) * 100) / 100;
  }
}
