import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TeacherGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!['TEACHER', 'ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Teacher or Admin access required');
    }

    return true;
  }
}
