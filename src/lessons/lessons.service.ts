import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    // Check if module exists
    const module = await this.prisma.module.findUnique({
      where: { id: createLessonDto.moduleId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Check if order is already taken
    const existingLesson = await this.prisma.lesson.findFirst({
      where: {
        moduleId: createLessonDto.moduleId,
        order: createLessonDto.order,
      },
    });

    if (existingLesson) {
      throw new BadRequestException('Lesson order already exists in this module');
    }

    return this.prisma.lesson.create({
      data: createLessonDto,
      include: {
        module: {
          select: {
            id: true,
            title: true,
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
    return this.prisma.lesson.findMany({
      include: {
        module: {
          select: {
            id: true,
            title: true,
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
      orderBy: [
        {
          module: {
            order: 'asc',
          },
        },
        {
          order: 'asc',
        },
      ],
    });
  }

  async findByModule(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            order: true,
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

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    // Check if lesson exists
    const existingLesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      throw new NotFoundException('Lesson not found');
    }

    // If updating order, check for conflicts
    if (updateLessonDto.order && updateLessonDto.order !== existingLesson.order) {
      const conflictingLesson = await this.prisma.lesson.findFirst({
        where: {
          moduleId: existingLesson.moduleId,
          order: updateLessonDto.order,
          id: { not: id },
        },
      });

      if (conflictingLesson) {
        throw new BadRequestException('Lesson order already exists in this module');
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: {
        module: {
          select: {
            id: true,
            title: true,
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

  async remove(id: string) {
    // Check if lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
