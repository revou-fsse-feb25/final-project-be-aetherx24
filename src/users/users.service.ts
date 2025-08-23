import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Note: Password should already be hashed by the calling service
    // No need to hash again here to avoid double hashing

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        // Password is already hashed from auth.service.ts
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);

    // If password is being updated, hash it
    let data = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changeRole(id: string, newRole: string, reason?: string) {
    // Check if user exists
    const existingUser = await this.findOne(id);

    // Validate role change
    if (existingUser.role === newRole) {
      throw new BadRequestException('User already has this role');
    }

    // Additional validation for role changes
    if (existingUser.role === 'ADMIN' && newRole !== 'ADMIN') {
      throw new BadRequestException('Cannot demote an admin user');
    }

    // Prevent creating multiple admins (optional security measure)
    if (newRole === 'ADMIN') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'ADMIN' }
      });
      if (adminCount >= 5) { // Limit to 5 admins
        throw new BadRequestException('Maximum number of admins reached (5)');
      }
    }

    // Update the user's role
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { 
        role: newRole,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log the role change (in a real system, you might want to store this in a separate table)
    console.log(`Role change: User ${existingUser.email} role changed from ${existingUser.role} to ${newRole}. Reason: ${reason || 'No reason provided'}`);

    return {
      message: `User role changed successfully from ${existingUser.role} to ${newRole}`,
      user: updatedUser,
      previousRole: existingUser.role,
      newRole: newRole,
      reason: reason,
      changedAt: new Date().toISOString()
    };
  }

  async remove(id: string) {
    // Check if user exists
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
