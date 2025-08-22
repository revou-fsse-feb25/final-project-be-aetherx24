import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserTodos(userId: string) {
    const [
      pendingAssignments,
      upcomingDueDates,
      incompleteLessons,
      pendingSubmissions,
    ] = await Promise.all([
      // Get assignments that are due soon or overdue
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
          dueDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Due within 7 days
          },
        },
        include: {
          course: {
            select: {
              title: true,
              code: true,
            },
          },
        },
        orderBy: {
          dueDate: 'asc',
        },
        take: 10,
      }),
      // Get assignments with upcoming due dates
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
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due within 14 days
          },
        },
        include: {
          course: {
            select: {
              title: true,
              code: true,
            },
          },
        },
        orderBy: {
          dueDate: 'asc',
        },
        take: 5,
      }),
      // Get lessons that haven't been completed (placeholder for future implementation)
      [],
      // Get submissions that need grading feedback
      this.prisma.submission.findMany({
        where: {
          studentId: userId,
          feedback: null,
        },
        include: {
          assignment: {
            select: {
              title: true,
              maxScore: true,
              course: {
                select: {
                  title: true,
                  code: true,
                },
              },
            },
          },
        },
        take: 5,
      }),
    ]);

    return {
      pendingAssignments: pendingAssignments.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        type: 'assignment',
        dueDate: assignment.dueDate,
        course: assignment.course,
        priority: assignment.dueDate && assignment.dueDate < new Date() ? 'high' : 'medium',
      })),
      upcomingDueDates: upcomingDueDates.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        type: 'assignment',
        dueDate: assignment.dueDate,
        course: assignment.course,
        priority: 'medium',
      })),
      incompleteLessons: incompleteLessons,
      pendingSubmissions: pendingSubmissions.map(submission => ({
        id: submission.id,
        title: `Feedback for: ${submission.assignment.title}`,
        type: 'feedback',
        submittedAt: submission.submittedAt,
        course: submission.assignment.course,
        priority: 'low',
      })),
    };
  }
}
