import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@lms.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      email: 'teacher1@lms.com',
      password: await bcrypt.hash('teacher123', 10),
      firstName: 'John',
      lastName: 'Smith',
      role: 'TEACHER',
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      email: 'teacher2@lms.com',
      password: await bcrypt.hash('teacher123', 10),
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'TEACHER',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@lms.com',
      password: await bcrypt.hash('student123', 10),
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'STUDENT',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@lms.com',
      password: await bcrypt.hash('student123', 10),
      firstName: 'Bob',
      lastName: 'Wilson',
      role: 'STUDENT',
    },
  });

  console.log('👥 Created users');

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to Computer Science',
      description: 'Learn the basics of programming and computer science fundamentals',
      code: 'CS101',
      credits: 3,
      teacherId: teacher1.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript basics for web development',
      code: 'WD101',
      credits: 4,
      teacherId: teacher2.id,
    },
  });

  console.log('📚 Created courses');

  // Create modules for course 1
  const module1 = await prisma.module.create({
    data: {
      title: 'Programming Basics',
      description: 'Introduction to programming concepts and logic',
      order: 1,
      courseId: course1.id,
    },
  });

  const module2 = await prisma.module.create({
    data: {
      title: 'Data Structures',
      description: 'Understanding arrays, lists, and basic data structures',
      order: 2,
      courseId: course1.id,
    },
  });

  // Create modules for course 2
  const module3 = await prisma.module.create({
    data: {
      title: 'HTML & CSS',
      description: 'Building the structure and styling of web pages',
      order: 1,
      courseId: course2.id,
    },
  });

  const module4 = await prisma.module.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Adding interactivity to web pages',
      order: 2,
      courseId: course2.id,
    },
  });

  console.log('📖 Created modules');

  // Create lessons
  await prisma.lesson.create({
    data: {
      title: 'What is Programming?',
      content: 'Programming is the process of creating a set of instructions that tell a computer how to perform a task.',
      order: 1,
      moduleId: module1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Variables and Data Types',
      content: 'Learn about different types of data and how to store them in variables.',
      order: 2,
      moduleId: module1.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'HTML Structure',
      content: 'Understanding HTML tags, elements, and document structure.',
      order: 1,
      moduleId: module3.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'CSS Styling',
      content: 'Learn how to style HTML elements with CSS properties.',
      order: 2,
      moduleId: module3.id,
    },
  });

  console.log('📝 Created lessons');

  // Create assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Programming Assignment 1',
      description: 'Write a simple calculator program that can perform basic arithmetic operations',
      courseId: course1.id,
      moduleId: module1.id,
      maxScore: 100,
      type: 'HOMEWORK',
      dueDate: new Date('2025-09-30T23:59:59Z'),
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'HTML Portfolio Project',
      description: 'Create a personal portfolio website using HTML and CSS',
      courseId: course2.id,
      moduleId: module3.id,
      maxScore: 150,
      type: 'PROJECT',
      dueDate: new Date('2025-10-15T23:59:59Z'),
    },
  });

  console.log('📋 Created assignments');

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      courseId: course1.id,
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student1.id,
      courseId: course2.id,
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student2.id,
      courseId: course1.id,
      status: 'ACTIVE',
    },
  });

  console.log('🎓 Created enrollments');

  // Create a sample submission
  await prisma.submission.create({
    data: {
      studentId: student1.id,
      assignmentId: assignment1.id,
      content: 'I created a calculator program that can add, subtract, multiply, and divide numbers.',
    },
  });

  console.log('📤 Created sample submission');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Sample Data Summary:');
  console.log(`👥 Users: ${await prisma.user.count()}`);
  console.log(`📚 Courses: ${await prisma.course.count()}`);
  console.log(`📖 Modules: ${await prisma.module.count()}`);
  console.log(`📝 Lessons: ${await prisma.lesson.count()}`);
  console.log(`📋 Assignments: ${await prisma.assignment.count()}`);
  console.log(`🎓 Enrollments: ${await prisma.enrollment.count()}`);
  console.log(`📤 Submissions: ${await prisma.submission.count()}`);
  
  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@lms.com / admin123');
  console.log('Teacher 1: teacher1@lms.com / teacher123');
  console.log('Teacher 2: teacher2@lms.com / teacher123');
  console.log('Student 1: student1@lms.com / student123');
  console.log('Student 2: student2@lms.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
