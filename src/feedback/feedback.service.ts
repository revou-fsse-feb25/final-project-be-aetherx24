import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecentFeedback(userId: string) {
    const [
      assignmentFeedback,
      submissionFeedback,
      courseGradeFeedback,
    ] = await Promise.all([
      // Get recent assignment feedback
      this.prisma.assignmentGrade.findMany({
        where: {
          studentId: userId,
          feedback: {
            not: null,
          },
        },
        include: {
          assignment: {
            select: {
              title: true,
              type: true,
            },
          },
          course: {
            select: {
              title: true,
              code: true,
            },
          },
        },
        orderBy: {
          gradedAt: 'desc',
        },
        take: 10,
      }),
      // Get recent submission feedback
      this.prisma.submission.findMany({
        where: {
          studentId: userId,
          feedback: {
            not: null,
          },
        },
        include: {
          assignment: {
            select: {
              title: true,
              type: true,
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
        orderBy: {
          gradedAt: 'desc',
        },
        take: 10,
      }),
      // Get recent course grade feedback
      this.prisma.courseGrade.findMany({
        where: {
          studentId: userId,
          comments: {
            not: null,
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
          updatedAt: 'desc',
        },
        take: 5,
      }),
    ]);

    // Combine and sort all feedback by date
    const allFeedback = [
      ...assignmentFeedback.map(feedback => ({
        id: feedback.id,
        type: 'assignment_grade',
        title: `Feedback for ${feedback.assignment.title}`,
        feedback: feedback.feedback,
        score: feedback.score,
        maxScore: feedback.maxScore,
        percentage: feedback.percentage,
        course: feedback.course,
        date: feedback.gradedAt,
        assignmentType: feedback.assignment.type,
      })),
      ...submissionFeedback.map(feedback => ({
        id: feedback.id,
        type: 'submission',
        title: `Feedback for ${feedback.assignment.title}`,
        feedback: feedback.feedback,
        score: feedback.score,
        maxScore: feedback.assignment.maxScore,
        percentage: feedback.score ? (feedback.score / feedback.assignment.maxScore) * 100 : null,
        course: feedback.assignment.course,
        date: feedback.gradedAt,
        assignmentType: feedback.assignment.type,
      })),
      ...courseGradeFeedback.map(feedback => ({
        id: feedback.id,
        type: 'course_grade',
        title: `Course feedback for ${feedback.course.title}`,
        feedback: feedback.comments,
        grade: feedback.letterGrade,
        percentage: feedback.percentage,
        course: feedback.course,
        date: feedback.updatedAt,
        assignmentType: 'course_overall',
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      recentFeedback: allFeedback.slice(0, 15), // Return top 15 most recent
      summary: {
        totalFeedback: allFeedback.length,
        assignmentFeedback: assignmentFeedback.length,
        submissionFeedback: submissionFeedback.length,
        courseFeedback: courseGradeFeedback.length,
      },
    };
  }
}
