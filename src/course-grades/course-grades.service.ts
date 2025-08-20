import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseGradeDto } from './dto/create-course-grade.dto';
import { UpdateCourseGradeDto } from './dto/update-course-grade.dto';

@Injectable()
export class CourseGradesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseGradeDto: CreateCourseGradeDto, userId: string, userRole: string) {
    // Only teachers and admins can create grades
    if (!['TEACHER', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Only teachers and admins can create course grades');
    }

    // Check if student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: createCourseGradeDto.studentId,
          courseId: createCourseGradeDto.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Student is not enrolled in this course');
    }

    // If teacher, verify they teach this course
    if (userRole === 'TEACHER') {
      const course = await this.prisma.course.findUnique({
        where: { id: createCourseGradeDto.courseId },
      });

      if (course.teacherId !== userId) {
        throw new ForbiddenException('You can only grade students in your own courses');
      }
    }

    return this.prisma.courseGrade.create({
      data: createCourseGradeDto,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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

  async findAll(userId: string, userRole: string) {
    if (userRole === 'ADMIN') {
      return this.prisma.courseGrade.findMany({
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
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

    if (userRole === 'TEACHER') {
      // Teachers can only see grades for courses they teach
      return this.prisma.courseGrade.findMany({
        where: {
          course: {
            teacherId: userId,
          },
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

    // Students can only see their own grades
    return this.prisma.courseGrade.findMany({
      where: {
        studentId: userId,
      },
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

  async findOne(id: string, userId: string, userRole: string) {
    const grade = await this.prisma.courseGrade.findUnique({
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
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });

    if (!grade) {
      throw new NotFoundException('Course grade not found');
    }

    // Check access permissions
    if (userRole === 'STUDENT' && grade.studentId !== userId) {
      throw new ForbiddenException('You can only view your own grades');
    }

    if (userRole === 'TEACHER') {
      const course = await this.prisma.course.findUnique({
        where: { id: grade.courseId },
      });

      if (course.teacherId !== userId) {
        throw new ForbiddenException('You can only view grades for courses you teach');
      }
    }

    return grade;
  }

  async update(id: string, updateCourseGradeDto: UpdateCourseGradeDto, userId: string, userRole: string) {
    const grade = await this.prisma.courseGrade.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!grade) {
      throw new NotFoundException('Course grade not found');
    }

    // Only teachers and admins can update grades
    if (!['TEACHER', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Only teachers and admins can update course grades');
    }

    // If teacher, verify they teach this course
    if (userRole === 'TEACHER' && grade.course.teacherId !== userId) {
      throw new ForbiddenException('You can only update grades for courses you teach');
    }

    return this.prisma.courseGrade.update({
      where: { id },
      data: updateCourseGradeDto,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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

  async remove(id: string, userId: string, userRole: string) {
    const grade = await this.prisma.courseGrade.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!grade) {
      throw new NotFoundException('Course grade not found');
    }

    // Only admins can delete grades
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete course grades');
    }

    return this.prisma.courseGrade.delete({
      where: { id },
    });
  }

  async findByStudent(studentId: string, userId: string, userRole: string) {
    // Check access permissions
    if (userRole === 'STUDENT' && studentId !== userId) {
      throw new ForbiddenException('You can only view your own grades');
    }

    if (userRole === 'TEACHER') {
      // Teachers can only see grades for students in their courses
      const hasAccess = await this.prisma.courseGrade.findFirst({
        where: {
          studentId,
          course: {
            teacherId: userId,
          },
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException('You can only view grades for students in your courses');
      }
    }

    return this.prisma.courseGrade.findMany({
      where: { studentId },
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

  async findByCourse(courseId: string, userId: string, userRole: string) {
    if (userRole === 'STUDENT') {
      // Students can only see grades for courses they're enrolled in
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId,
          },
        },
      });

      if (!enrollment) {
        throw new ForbiddenException('You are not enrolled in this course');
      }

      return this.prisma.courseGrade.findMany({
        where: {
          courseId,
          studentId: userId,
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
        },
      });
    }

    if (userRole === 'TEACHER') {
      // Teachers can only see grades for courses they teach
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      if (course.teacherId !== userId) {
        throw new ForbiddenException('You can only view grades for courses you teach');
      }
    }

    return this.prisma.courseGrade.findMany({
      where: { courseId },
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
    });
  }
}
