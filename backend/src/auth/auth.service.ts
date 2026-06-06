import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { CurrentUser, UserRole } from './auth.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async login(loginDto: LoginDto): Promise<{ user: CurrentUser }> {
    if (!loginDto.email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { user: this.toCurrentUser(user) };
  }

  async getCurrentUser(userId?: number, email?: string): Promise<CurrentUser> {
    const user = userId !== undefined
      ? await this.usersRepository.findOne({ where: { id: userId } })
      : email
        ? await this.usersRepository.findOne({ where: { email: email.toLowerCase() } })
        : null;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toCurrentUser(user);
  }

  private toCurrentUser(user: UserEntity): CurrentUser {
    return {
      id: user.id,
      name: `${user.name} ${user.lastName}`.trim(),
      email: user.email,
      role: this.mapRole(user.role),
    };
  }

  private mapRole(role: UserEntity['role']): UserRole {
    if (role === 'admin') {
      return 'admin';
    }

    if (role === 'super_admin') {
      return 'super-admin';
    }

    return 'client';
  }
}
