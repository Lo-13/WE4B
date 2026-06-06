import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { NosqlService } from '../nosql/nosql.service';
import { CurrentUser, UserRole } from './auth.model';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly nosqlService: NosqlService,
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

    const validUser = await this.ensureValidUserId(user);
    const currentUser = this.toCurrentUser(validUser);
    await this.nosqlService.logActivity({
      userId: currentUser.id,
      email: currentUser.email,
      action: 'login',
      targetType: 'user',
      targetId: currentUser.id,
      metadata: { role: currentUser.role },
    });

    return { user: currentUser };
  }

  async register(registerDto: RegisterDto): Promise<{ user: CurrentUser }> {
    const email = registerDto.email?.trim().toLowerCase();
    const name = registerDto.name?.trim();
    const lastName = registerDto.lastName?.trim();

    if (!email || !name || !lastName) {
      throw new BadRequestException('Name, last name and email are required');
    }

    const existingUser = await this.usersRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const savedUser = await this.usersRepository.save(
      this.usersRepository.create({
        id: await this.getNextUserId(),
        email,
        name,
        lastName,
        age: Number(registerDto.age ?? 18),
        password: registerDto.password?.trim() || 'temporary-password',
        role: 'user',
        registrationDate: new Date(),
      }),
    );

    const currentUser = this.toCurrentUser(savedUser);
    await this.nosqlService.logActivity({
      userId: currentUser.id,
      email: currentUser.email,
      action: 'user_registered',
      targetType: 'user',
      targetId: currentUser.id,
      metadata: { role: currentUser.role },
    });

    return { user: currentUser };
  }

  async logout(loginDto: LoginDto): Promise<{ success: true }> {
    if (loginDto.email) {
      const email = loginDto.email.toLowerCase();
      const user = await this.usersRepository.findOne({ where: { email } });

      await this.nosqlService.logActivity({
        userId: user?.id,
        email,
        action: 'logout',
        targetType: 'user',
        targetId: user?.id,
        metadata: { role: user ? this.mapRole(user.role) : undefined },
      });
    }

    return { success: true };
  }

  async getCurrentUser(userId?: number, email?: string): Promise<CurrentUser> {
    const user =
      userId !== undefined
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

  private async ensureValidUserId(user: UserEntity): Promise<UserEntity> {
    if (user.id > 0) {
      return user;
    }

    const nextUserId = await this.getNextUserId();
    await this.usersRepository.update({ id: user.id }, { id: nextUserId });

    return {
      ...user,
      id: nextUserId,
    };
  }

  private async getNextUserId(): Promise<number> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select('MAX(user.id)', 'maxId')
      .getRawOne<{ maxId: number | string | null }>();

    return Number(result?.maxId ?? 0) + 1;
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
