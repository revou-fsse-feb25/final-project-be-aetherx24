import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createAssignmentDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // If moduleId is provided, check if it exists and belongs to the course
    if (createAssignmentDto.moduleId) {
      const module = await this.prisma.module.findFirst({
        where: {
          id: createAssignmentDto.moduleId,
          courseId: createAssignmentDto.courseId,
        },
      });

      if (!module) {
        throw new BadRequestException('Module not found or does not belong to the specified course');
      }
    }

    return this.prisma.assignment.create({
      data: createAssignmentDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.assignment.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        submissions: {
          select: {
            id: true,
            submittedAt: true,
            score: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.assignment.findMany({
      where: { courseId },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        submissions: {
          select: {
            id: true,
            submittedAt: true,
            score: true,
          },
        },
      },
      orderBy: [
        {
          module: {
            order: 'asc',
          },
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        submissions: {
          select: {
            id: true,
            studentId: true,
            submittedAt: true,
            score: true,
            feedback: true,
            student: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    // Check if assignment exists
    const existingAssignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    // If updating courseId, check if new course exists
    if (updateAssignmentDto.courseId && updateAssignmentDto.courseId !== existingAssignment.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: updateAssignmentDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    // If updating moduleId, check if it exists and belongs to the course
    if (updateAssignmentDto.moduleId && updateAssignmentDto.moduleId !== existingAssignment.moduleId) {
      const courseId = updateAssignmentDto.courseId || existingAssignment.courseId;
      const module = await this.prisma.module.findFirst({
        where: {
          id: updateAssignmentDto.moduleId,
          courseId,
        },
      });

      if (!module) {
        throw new BadRequestException('Module not found or does not belong to the specified course');
      }
    }

    return this.prisma.assignment.update({
      where: { id },
      data: updateAssignmentDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if assignment exists
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: {
          select: { id: true },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if assignment has submissions
    if (assignment.submissions.length > 0) {
      throw new BadRequestException('Cannot delete assignment with existing submissions');
    }

    return this.prisma.assignment.delete({
      where: { id },
    });
  }
}
