import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleDto: CreateModuleDto) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createModuleDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if order is already taken
    const existingModule = await this.prisma.module.findFirst({
      where: {
        courseId: createModuleDto.courseId,
        order: createModuleDto.order,
      },
    });

    if (existingModule) {
      throw new BadRequestException('Module order already exists in this course');
    }

    return this.prisma.module.create({
      data: createModuleDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.module.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getModulesByCourse(courseId: string) {
    // First check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        code: true,
        description: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Get all modules for the course with their lessons
    const modules = await this.prisma.module.findMany({
      where: { 
        courseId: courseId,
        isActive: true 
      },
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            content: true,
            order: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      course,
      modules,
    };
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            content: true,
            order: true,
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    // Check if module exists
    const existingModule = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!existingModule) {
      throw new NotFoundException('Module not found');
    }

    // If updating order, check for conflicts
    if (updateModuleDto.order && updateModuleDto.order !== existingModule.order) {
      const conflictingModule = await this.prisma.module.findFirst({
        where: {
          courseId: existingModule.courseId,
          order: updateModuleDto.order,
          id: { not: id },
        },
      });

      if (conflictingModule) {
        throw new BadRequestException('Module order already exists in this course');
      }
    }

    return this.prisma.module.update({
      where: { id },
      data: updateModuleDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if module exists
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        lessons: {
          select: { id: true },
        },
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Check if module has lessons
    if (module.lessons.length > 0) {
      throw new BadRequestException('Cannot delete module with existing lessons');
    }

    return this.prisma.module.delete({
      where: { id },
    });
  }
}
