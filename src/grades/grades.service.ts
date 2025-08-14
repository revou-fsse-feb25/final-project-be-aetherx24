import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(createGradeDto: CreateGradeDto) {
    // Check if student exists
    const student = await this.prisma.user.findUnique({
      where: { id: createGradeDto.studentId },
    });

    if (!student || student.role !== 'STUDENT') {
      throw new NotFoundException('Student not found or user is not a student');
    }

    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createGradeDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: createGradeDto.studentId,
          courseId: createGradeDto.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Student is not enrolled in this course');
    }

    const grade = await this.prisma.grade.create({
      data: {
        ...createGradeDto,
        dueDate: createGradeDto.dueDate ? new Date(createGradeDto.dueDate) : null,
        submittedAt: new Date(), // Set current time as submission time
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

    return grade;
  }

  async findAll() {
    return this.prisma.grade.findMany({
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

  async findOne(id: string) {
    const grade = await this.prisma.grade.findUnique({
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
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    return grade;
  }

  async findByStudent(studentId: string) {
    return this.prisma.grade.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.grade.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateGradeDto: UpdateGradeDto) {
    // Check if grade exists
    await this.findOne(id);

    const data: any = { ...updateGradeDto };
    
    // Convert dueDate string to Date if provided
    if (updateGradeDto.dueDate) {
      data.dueDate = new Date(updateGradeDto.dueDate);
    }

    const grade = await this.prisma.grade.update({
      where: { id },
      data,
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

    return grade;
  }

  async remove(id: string) {
    // Check if grade exists
    await this.findOne(id);

    await this.prisma.grade.delete({
      where: { id },
    });

    return { message: 'Grade deleted successfully' };
  }

  async getStudentGPA(studentId: string) {
    const grades = await this.prisma.grade.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            credits: true,
          },
        },
      },
    });

    if (grades.length === 0) {
      return { gpa: 0, totalCredits: 0, totalGrades: 0 };
    }

    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
      const percentage = (grade.score / grade.maxScore) * 100;
      let gradePoints = 0;

      // Simple GPA calculation (you can modify this based on your grading system)
      if (percentage >= 90) gradePoints = 4.0;
      else if (percentage >= 80) gradePoints = 3.0;
      else if (percentage >= 70) gradePoints = 2.0;
      else if (percentage >= 60) gradePoints = 1.0;
      else gradePoints = 0.0;

      totalPoints += gradePoints * grade.course.credits;
      totalCredits += grade.course.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return {
      gpa: Math.round(gpa * 100) / 100, // Round to 2 decimal places
      totalCredits,
      totalGrades: grades.length,
    };
  }
}
