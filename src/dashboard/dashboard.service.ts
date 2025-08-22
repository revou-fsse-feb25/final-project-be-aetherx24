import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
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
      summary: {
        totalCourses,
        completedAssignments,
        upcomingAssignments,
      },
      recentEnrollments: enrollments,
      recentAssignments: assignments,
      recentSubmissions: submissions,
      recentGrades: courseGrades,
    };
  }
}
