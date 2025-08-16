import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto, GradeSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto, userId: string) {
    // Check if assignment exists
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: createSubmissionDto.assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if assignment is active
    if (!assignment.isActive) {
      throw new BadRequestException('Assignment is not active');
    }

    // Check if due date has passed
    if (assignment.dueDate && new Date() > assignment.dueDate) {
      throw new BadRequestException('Assignment due date has passed');
    }

    // Check if student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: createSubmissionDto.studentId,
        courseId: assignment.courseId,
        status: 'ACTIVE',
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('Student is not enrolled in this course');
    }

    // Check if student already submitted
    const existingSubmission = await this.prisma.submission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: createSubmissionDto.studentId,
          assignmentId: createSubmissionDto.assignmentId,
        },
      },
    });

    if (existingSubmission) {
      throw new BadRequestException('Student has already submitted this assignment');
    }

    return this.prisma.submission.create({
      data: createSubmissionDto,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.submission.findMany({
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async findByAssignment(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.submission.findMany({
      where: { studentId },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            dueDate: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            dueDate: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  async update(id: string, updateSubmissionDto: UpdateSubmissionDto, userId: string) {
    // Check if submission exists
    const existingSubmission = await this.prisma.submission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      throw new NotFoundException('Submission not found');
    }

    // Only allow students to update their own submissions
    if (existingSubmission.studentId !== userId) {
      throw new ForbiddenException('You can only update your own submissions');
    }

    // Check if assignment is still active
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: existingSubmission.assignmentId },
    });

    if (!assignment.isActive) {
      throw new BadRequestException('Assignment is not active');
    }

    // Check if due date has passed
    if (assignment.dueDate && new Date() > assignment.dueDate) {
      throw new BadRequestException('Assignment due date has passed');
    }

    return this.prisma.submission.update({
      where: { id },
      data: updateSubmissionDto,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async grade(id: string, gradeSubmissionDto: GradeSubmissionDto, teacherId: string) {
    // Check if submission exists
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check if the user is the teacher of the course
    if (submission.assignment.course.teacherId !== teacherId) {
      throw new ForbiddenException('Only the course teacher can grade submissions');
    }

    // Check if score is within valid range
    if (gradeSubmissionDto.score > submission.assignment.maxScore) {
      throw new BadRequestException('Score cannot exceed maximum possible score');
    }

    return this.prisma.submission.update({
      where: { id },
      data: {
        score: gradeSubmissionDto.score,
        feedback: gradeSubmissionDto.feedback,
        gradedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            maxScore: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    // Check if submission exists
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Only allow students to delete their own submissions
    if (submission.studentId !== userId) {
      throw new ForbiddenException('You can only delete your own submissions');
    }

    return this.prisma.submission.delete({
      where: { id },
    });
  }
}
