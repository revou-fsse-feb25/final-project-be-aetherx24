import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    // Check if course code already exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { code: createCourseDto.code },
    });

    if (existingCourse) {
      throw new ConflictException('Course with this code already exists');
    }

    // Check if teacher exists
    const teacher = await this.prisma.user.findUnique({
      where: { id: createCourseDto.teacherId },
    });

    if (!teacher || teacher.role !== 'TEACHER') {
      throw new NotFoundException('Teacher not found or user is not a teacher');
    }

    const course = await this.prisma.course.create({
      data: createCourseDto,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return course;
  }

  async findAll() {
    return this.prisma.course.findMany({
      where: { isActive: true },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        modules: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    // Check if course exists
    await this.findOne(id);

    // If code is being updated, check for conflicts
    if (updateCourseDto.code) {
      const existingCourse = await this.prisma.course.findFirst({
        where: {
          code: updateCourseDto.code,
          id: { not: id },
        },
      });

      if (existingCourse) {
        throw new ConflictException('Course with this code already exists');
      }
    }

    const course = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return course;
  }

  async remove(id: string) {
    // Check if course exists
    await this.findOne(id);

    // Soft delete by setting isActive to false
    await this.prisma.course.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Course deleted successfully' };
  }
}
