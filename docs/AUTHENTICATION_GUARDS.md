# 🔐 Authentication Guards Documentation

This document provides comprehensive information about authentication guards, role-based access control, and authorization mechanisms in the Learning Management System (LMS) backend.

## 📋 Table of Contents

- [🔍 Overview](#-overview)
- [🛡️ Available Guards](#️-available-guards)
- [👥 Role-Based Access Control](#-role-based-access-control)
- [🎯 Guard Implementation](#-guard-implementation)
- [🔧 Usage Examples](#️-usage-examples)
- [📝 Decorators](#-decorators)
- [🚨 Error Handling](#-error-handling)
- [🔄 Guard Combinations](#️-guard-combinations)
- [📚 Best Practices](#-best-practices)
- [🔧 Troubleshooting](#-troubleshooting)

---

## 🔍 Overview

The LMS backend implements a comprehensive authentication and authorization system using NestJS guards. This system ensures that:

- **Authentication**: Users must provide valid JWT tokens
- **Authorization**: Users can only access resources they're authorized for
- **Role-Based Access**: Different user roles have different permissions
- **Resource Ownership**: Users can only modify their own resources

### System Architecture

```
Request → JWT Guard → Role Guard → Controller → Service
   ↓           ↓         ↓           ↓         ↓
Validate   Extract   Check      Execute   Return
Token      User      Role      Business  Response
```

---

## 🛡️ Available Guards

### 1. **JwtAuthGuard** - Base Authentication

**Purpose**: Validates JWT tokens and extracts user information

**Location**: `src/auth/guards/jwt-auth.guard.ts`

**What it does**:
- Extracts JWT token from Authorization header
- Validates token signature and expiration
- Attaches user object to `request.user`
- Handles token format errors

**User Object Structure**:
```typescript
{
  sub: "user_id_here",
  email: "user@example.com",
  role: "STUDENT" | "TEACHER" | "ADMIN"
}
```

### 2. **AdminGuard** - Admin-Only Access

**Purpose**: Restricts access to ADMIN users only

**Location**: `src/auth/guards/admin.guard.ts`

**What it does**:
- Checks if user has ADMIN role
- Throws 403 Forbidden for non-admin users
- Must be used after JwtAuthGuard

**Usage**: `@UseGuards(JwtAuthGuard, AdminGuard)`

### 3. **TeacherGuard** - Teacher/Admin Access

**Purpose**: Allows TEACHER and ADMIN users

**Location**: `src/auth/guards/teacher.guard.ts`

**What it does**:
- Checks if user has TEACHER or ADMIN role
- Throws 403 Forbidden for STUDENT users
- Must be used after JwtAuthGuard

**Usage**: `@UseGuards(JwtAuthGuard, TeacherGuard)`

### 4. **RoleGuard** - Flexible Role-Based Access

**Purpose**: Allows multiple roles with custom decorator

**Location**: `src/auth/guards/role.guard.ts`

**What it does**:
- Reads required roles from `@Roles()` decorator
- Checks if user has any of the required roles
- Flexible role combinations
- Must be used after JwtAuthGuard

**Usage**: `@UseGuards(JwtAuthGuard, RoleGuard)` + `@Roles('TEACHER', 'ADMIN')`

---

## 👥 Role-Based Access Control

### User Roles and Capabilities

#### 🔐 **ADMIN** - Full System Access
- **User Management**: Create, read, update, delete all users
- **Role Management**: Change user roles
- **Course Oversight**: View all courses and enrollments
- **System Administration**: Access system-wide analytics
- **Guard Usage**: Can access any endpoint

#### 👨‍🏫 **TEACHER** - Course Management
- **Course Management**: Create, update, delete own courses
- **Assignment Management**: Create and grade assignments
- **Student Management**: View enrolled students
- **Content Management**: Manage modules and lessons
- **Guard Usage**: `TeacherGuard` or `@Roles('TEACHER')`

#### 👨‍🎓 **STUDENT** - Learning Access
- **Course Access**: View enrolled courses
- **Assignment Submission**: Submit assignments
- **Grade Viewing**: View own grades and feedback
- **Progress Tracking**: Monitor learning progress
- **Guard Usage**: `JwtAuthGuard` only (no additional role guards)

### Role Hierarchy

```
ADMIN > TEACHER > STUDENT
  ↓       ↓        ↓
Full   Course   Limited
Access  Mgmt    Access
```

---

## 🎯 Guard Implementation

### JWT Strategy Configuration

```typescript
// src/auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,        // User ID
      email: payload.email,    // User email
      role: payload.role,      // User role
    };
  }
}
```

### Guard Implementation Examples

#### AdminGuard
```typescript
// src/auth/guards/admin.guard.ts
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
```

#### RoleGuard
```typescript
// src/auth/guards/role.guard.ts
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
```

---

## 🔧 Usage Examples

### 1. **Admin-Only Endpoints**

```typescript
// src/users/users.controller.ts
@Controller('users')
export class UsersController {
  
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user role (Admin only)' })
  changeRole(@Param('id') id: string, @Body() changeRoleDto: ChangeRoleDto) {
    return this.usersService.changeRole(id, changeRoleDto.role, changeRoleDto.reason);
  }
}
```

### 2. **Teacher/Admin Endpoints**

```typescript
// src/assignments/assignments.controller.ts
@Controller('assignments')
export class AssignmentsController {
  
  @Post()
  @UseGuards(JwtAuthGuard, TeacherGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create assignment (Teacher/Admin only)' })
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }
}
```

### 3. **Flexible Role-Based Access**

```typescript
// src/courses/courses.controller.ts
@Controller('courses')
export class CoursesController {
  
  @Get('admin/analytics')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TEACHER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course analytics (Admin/Teacher only)' })
  getAnalytics() {
    return this.coursesService.getAnalytics();
  }

  @Get('teacher/dashboard')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('TEACHER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get teacher dashboard (Teacher only)' })
  getTeacherDashboard(@Request() req) {
    return this.coursesService.getTeacherDashboard(req.user.sub);
  }
}
```

### 4. **Student-Only Endpoints**

```typescript
// src/enrollments/enrollments.controller.ts
@Controller('enrollments')
export class EnrollmentsController {
  
  @Get('my-enrollments')
  @UseGuards(JwtAuthGuard) // No additional role guard needed
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user enrollments (Authenticated users)' })
  getMyEnrollments(@Request() req) {
    return this.enrollmentsService.findByStudent(req.user.sub);
  }
}
```

---

## 📝 Decorators

### @Roles() Decorator

**Purpose**: Specifies required roles for endpoints

**Location**: `src/auth/decorators/roles.decorator.ts`

**Implementation**:
```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

**Usage Examples**:
```typescript
@Roles('ADMIN')                    // Admin only
@Roles('TEACHER', 'ADMIN')        // Teacher or Admin
@Roles('STUDENT', 'TEACHER')      // Student or Teacher
@Roles('ADMIN', 'TEACHER')        // Admin or Teacher
```

### @ApiBearerAuth() Decorator

**Purpose**: Documents JWT authentication requirement in Swagger

**Usage**: Add to all protected endpoints

**Example**:
```typescript
@Get('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get user dashboard' })
getDashboard(@Request() req) {
  return this.dashboardService.getDashboard(req.user.sub, req.user.role);
}
```

---

## 🚨 Error Handling

### Guard Error Responses

#### 1. **JWT Authentication Failed**
```json
{
  "message": "Unauthorized - JWT token required",
  "error": "Unauthorized",
  "statusCode": 401,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/dashboard"
}
```

#### 2. **Insufficient Permissions**
```json
{
  "message": "Admin access required",
  "error": "Forbidden",
  "statusCode": 403,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/users"
}
```

#### 3. **Role-Based Access Denied**
```json
{
  "message": "Access denied. Required roles: TEACHER, ADMIN",
  "error": "Forbidden",
  "statusCode": 403,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/courses/admin/analytics"
}
```

### Error Handling in Guards

```typescript
// Example: Custom error messages
@Injectable()
export class CustomAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      throw new UnauthorizedException('Please log in to access this resource');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        `Access denied. You need administrator privileges to perform this action.`
      );
    }

    return true;
  }
}
```

---

## 🔄 Guard Combinations

### Common Guard Patterns

#### 1. **Admin-Only Access**
```typescript
@UseGuards(JwtAuthGuard, AdminGuard)
```

#### 2. **Teacher/Admin Access**
```typescript
@UseGuards(JwtAuthGuard, TeacherGuard)
```

#### 3. **Flexible Role Access**
```typescript
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('TEACHER', 'ADMIN')
```

#### 4. **Resource Owner + Role Access**
```typescript
@UseGuards(JwtAuthGuard, RoleGuard, ResourceOwnerGuard)
@Roles('TEACHER', 'ADMIN')
```

### Guard Execution Order

**Important**: Guards execute in the order they're specified

```typescript
@UseGuards(JwtAuthGuard, AdminGuard, CustomGuard)
// Execution order:
// 1. JwtAuthGuard - Validates JWT token
// 2. AdminGuard - Checks admin role
// 3. CustomGuard - Additional business logic
```

---

## 📚 Best Practices

### 1. **Guard Organization**

- Keep guards in `src/auth/guards/` directory
- Use descriptive names (e.g., `AdminGuard`, `TeacherGuard`)
- Implement single responsibility principle
- Document guard behavior clearly

### 2. **Error Messages**

- Provide clear, actionable error messages
- Don't expose sensitive information
- Use consistent error format
- Include required roles in error messages

### 3. **Performance Considerations**

- Guards execute on every request
- Keep guard logic lightweight
- Avoid database queries in guards when possible
- Use caching for role checks if needed

### 4. **Security Best Practices**

- Always validate JWT tokens first
- Check roles after authentication
- Implement proper error handling
- Log security violations
- Use HTTPS in production

### 5. **Testing Guards**

```typescript
// Example test for AdminGuard
describe('AdminGuard', () => {
  let guard: AdminGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('should allow admin users', () => {
    const mockRequest = {
      user: { role: 'ADMIN' }
    };
    
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext;

    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should deny non-admin users', () => {
    const mockRequest = {
      user: { role: 'TEACHER' }
    };
    
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext))
      .toThrow(ForbiddenException);
  });
});
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **Guard Not Working**

**Symptoms**: Endpoint accessible without proper authentication

**Possible Causes**:
- Guard not imported in module
- Guard not applied to endpoint
- Wrong guard order

**Solutions**:
```typescript
// Ensure guard is imported
@Module({
  imports: [AuthModule],
  providers: [AdminGuard, TeacherGuard, RoleGuard],
})

// Apply guard correctly
@UseGuards(JwtAuthGuard, AdminGuard)

// Check guard order
@UseGuards(JwtAuthGuard, AdminGuard) // JWT first, then role
```

#### 2. **Circular Dependency**

**Symptoms**: Module cannot be created due to circular imports

**Solutions**:
```typescript
// Use forwardRef for circular dependencies
@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService, AdminGuard, TeacherGuard, RoleGuard],
  exports: [AuthService, AdminGuard, TeacherGuard, RoleGuard],
})
export class AuthModule {}
```

#### 3. **Role Not Recognized**

**Symptoms**: Users get access denied despite having correct role

**Possible Causes**:
- Role not in JWT payload
- Role case mismatch
- Guard not reading correct user property

**Solutions**:
```typescript
// Check JWT strategy
async validate(payload: any) {
  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role, // Ensure this matches database
  };
}

// Check guard implementation
if (user.role !== 'ADMIN') { // Ensure case matches
  throw new ForbiddenException('Admin access required');
}
```

#### 4. **Multiple Role Requirements**

**Symptoms**: Complex role combinations not working

**Solutions**:
```typescript
// Use RoleGuard with @Roles decorator
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('TEACHER', 'ADMIN')
getTeacherResources() {
  // Accessible by TEACHER or ADMIN
}

// Or implement custom logic
@UseGuards(JwtAuthGuard, CustomRoleGuard)
getComplexAccess() {
  // Custom role logic
}
```

### Debug Mode

Enable guard debugging in development:

```typescript
// main.ts
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('User:', req.user);
    console.log('Role:', req.user?.role);
    console.log('Path:', req.path);
    next();
  });
}
```

---

## 📚 Additional Resources

- [NestJS Guards Documentation](https://docs.nestjs.com/guards)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://jwt.io/introduction)
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control)

---

## 🔄 Guard Updates

This documentation should be updated whenever:

- New guards are added
- Guard behavior changes
- New role types are introduced
- Security policies are updated
- Error handling patterns change

---

**Note**: Guards are critical security components. Always test thoroughly and review security implications before deployment.
