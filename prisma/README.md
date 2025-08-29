# 🌱 Database Seed Data Documentation

This document describes the seed data that populates the Learning Management System (LMS) database with sample data for development and testing purposes.

## 📋 Overview

The `seed.ts` file creates a complete LMS environment with:
- **Users** (Admin, Teachers, Students)
- **Courses** with structured content
- **Modules** and **Lessons**
- **Assignments** and **Submissions**
- **Grades** and **Enrollments**

## 🚀 Quick Start

### Running the Seed Script

```bash
# Install dependencies (if not already done)
npm install

# Run the seed script
npx prisma db seed

# Or run directly with Node
npx ts-node prisma/seed.ts
```

### Prerequisites

- Database connection configured in `.env`
- Prisma schema up to date
- Database migrations applied

## 👥 User Accounts

### 🔐 Admin Users
| Email | Password | Role | Name |
|-------|----------|------|------|
| `admin@lms.com` | `admin123` | ADMIN | Admin User |

**Capabilities:**
- Full system access
- User management
- Course oversight
- System administration

### 👨‍🏫 Teacher Accounts
| Email | Password | Role | Name | Assigned Courses |
|-------|----------|------|------|------------------|
| `teacher1@lms.com` | `teacher123` | TEACHER | John Smith | CS101 |
| `teacher2@lms.com` | `teacher123` | TEACHER | Jane Doe | WD101 |

**Capabilities:**
- Course management
- Assignment creation
- Student grading
- Progress monitoring

### 👨‍🎓 Student Accounts
| Email | Password | Role | Name | Enrolled Courses |
|-------|----------|------|------|------------------|
| `student1@lms.com` | `student123` | STUDENT | Alice Johnson | CS101, WD101 |
| `student2@lms.com` | `student123` | STUDENT | Bob Wilson | CS101 |

**Capabilities:**
- Course enrollment
- Assignment submission
- Grade viewing
- Progress tracking

## 📚 Course Structure

### 🖥️ CS101: Introduction to Computer Science
**Teacher:** John Smith  
**Credits:** 3  
**Description:** Learn the basics of programming and computer science fundamentals

#### 📖 Modules
1. **Programming Basics** (Order: 1)
   - **Lesson 1:** What is Programming?
   - **Lesson 2:** Variables and Data Types

2. **Data Structures** (Order: 2)
   - *Additional lessons can be added here*

#### 📋 Assignments
- **Programming Assignment 1** (HOMEWORK)
  - Due: September 30, 2025
  - Max Score: 100
  - Description: Write a simple calculator program

### 🌐 WD101: Web Development Fundamentals
**Teacher:** Jane Doe  
**Credits:** 4  
**Description:** Learn HTML, CSS, and JavaScript basics for web development

#### 📖 Modules
1. **HTML & CSS** (Order: 1)
   - **Lesson 1:** HTML Structure
   - **Lesson 2:** CSS Styling

2. **JavaScript Fundamentals** (Order: 2)
   - *Additional lessons can be added here*

#### 📋 Assignments
- **HTML Portfolio Project** (PROJECT)
  - Due: October 15, 2025
  - Max Score: 150
  - Description: Create a personal portfolio website

## 📊 Sample Data

### 🎓 Enrollments
- **Alice Johnson** enrolled in both CS101 and WD101
- **Bob Wilson** enrolled in CS101 only

### 📤 Submissions & Grades
- **Sample Submission:** Alice's calculator program (85/100)
- **Course Grades:** 
  - CS101: B+ (87.5%)
  - WD101: A- (92.0%)

### 📈 Assignment Types Available
- **HOMEWORK** - Regular assignments
- **QUIZ** - Short assessments  
- **EXAM** - Major tests
- **PROJECT** - Long-term projects

## 🛠️ Development Workflow

### 1. Reset Database
```bash
# Clear all data and start fresh
npx prisma db push --force-reset
npx prisma db seed
```

### 2. Add New Sample Data
Edit `seed.ts` to add:
- New users with different roles
- Additional courses and modules
- More assignments and submissions
- Sample grades and feedback

### 3. Customize for Testing
```typescript
// Example: Add a new test student
const testStudent = await prisma.user.create({
  data: {
    email: 'test@example.com',
    password: await bcrypt.hash('test123', 10),
    firstName: 'Test',
    lastName: 'User',
    role: 'STUDENT',
  },
});
```

## 🔍 Data Relationships

```
User (Teacher) → Course → Module → Lesson
                ↓
            Assignment → Submission → Grade
                ↓
            Enrollment ← User (Student)
```

## 📝 Customization Tips

### Adding New Courses
```typescript
const newCourse = await prisma.course.create({
  data: {
    title: 'Advanced JavaScript',
    description: 'Deep dive into modern JavaScript',
    code: 'JS201',
    credits: 4,
    teacherId: teacher2.id, // Assign to existing teacher
  },
});
```

### Adding New Assignments
```typescript
const newAssignment = await prisma.assignment.create({
  data: {
    title: 'Final Project',
    description: 'Build a complete web application',
    courseId: course2.id,
    maxScore: 200,
    type: 'PROJECT',
    dueDate: new Date('2025-12-15T23:59:59Z'),
  },
});
```

### Adding New Users
```typescript
const newUser = await prisma.user.create({
  data: {
    email: 'newuser@lms.com',
    password: await bcrypt.hash('password123', 10),
    firstName: 'New',
    lastName: 'User',
    role: 'STUDENT', // or 'TEACHER' or 'ADMIN'
  },
});
```

## 🚨 Important Notes

### Password Security
- All passwords are hashed using bcrypt with salt rounds of 10
- Default passwords are simple for development (change in production)
- Never commit real passwords to version control

### Data Cleanup
The seed script automatically clears existing data before seeding:
```typescript
// Order matters due to foreign key constraints
await prisma.assignmentGrade.deleteMany();
await prisma.courseGrade.deleteMany();
await prisma.submission.deleteMany();
await prisma.assignment.deleteMany();
await prisma.lesson.deleteMany();
await prisma.module.deleteMany();
await prisma.enrollment.deleteMany();
await prisma.course.deleteMany();
await prisma.user.deleteMany();
```

### Production Considerations
- Remove or modify seed script before production deployment
- Use environment variables for sensitive data
- Implement proper user registration flow
- Add data validation and sanitization

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `.env` file for database URL
   - Ensure database is running
   - Verify Prisma schema is up to date

2. **Foreign Key Constraint Errors**
   - Ensure seed script runs in correct order
   - Check that referenced IDs exist before use

3. **Permission Errors**
   - Verify database user has CREATE/DELETE permissions
   - Check database connection string

### Debug Mode
Add logging to see what's happening:
```typescript
console.log('Creating user:', userData);
const user = await prisma.user.create({ data: userData });
console.log('Created user with ID:', user.id);
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Database Schema](prisma/schema.prisma)
- [API Documentation](http://localhost:3000/api) (when running)

---

**Happy Seeding! 🌱** 

This seed data provides a solid foundation for testing and developing your LMS application.
