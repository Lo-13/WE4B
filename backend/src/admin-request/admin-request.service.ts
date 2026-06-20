import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRequestEntity } from './admin-request.entity';
import { AdminRequestDto } from './dto/admin-request.dto';
import { UserEntity } from '../database/entities/user.entity';
import { RoomAdministratorEntity } from '../database/entities/room-administrator.entity';

export interface AdminRequestDetail {
  requestId: number;
  userId: number;
  roomId: number;
  status: 'pending' | 'accepted' | 'denied';
  createdDate: Date;
}

@Injectable()
export class AdminRequestService {
  constructor(
    @InjectRepository(AdminRequestEntity)
    private adminRequestRepository: Repository<AdminRequestEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoomAdministratorEntity)
    private roomAdministratorRepository: Repository<RoomAdministratorEntity>,
  ) {}

  async create(dto: AdminRequestDto): Promise<AdminRequestEntity> {
    const newRequest = this.adminRequestRepository.create({
      userId: dto.userId,
      roomId: dto.roomId,
      status: 'pending' as const,
    });
    return this.adminRequestRepository.save(newRequest);
  }

  async findPending(): Promise<AdminRequestDetail[]> {
    const requests = await this.adminRequestRepository.find({ where: { status: 'pending' } });
    return requests.map((req) => ({
      requestId: req.requestId,
      userId: req.userId,
      roomId: req.roomId,
      status: req.status,
      createdDate: req.createdDate,
    }));
  }

  async findAdmins(): Promise<{ userId: number; roomId: number }[]> {
    const roomAdmins = await this.roomAdministratorRepository.find();
    return roomAdmins.map((ra) => ({ userId: ra.userId, roomId: ra.roomId }));
  }

  async accept(requestId: number): Promise<void> {
    const request = await this.adminRequestRepository.findOne({ where: { requestId } });
    if (!request) return;
    await this.adminRequestRepository.update(requestId, { status: 'accepted' });
    await this.userRepository.update(request.userId, { role: 'admin' });
    await this.roomAdministratorRepository.save({ roomId: request.roomId, userId: request.userId });
  }

  async deny(requestId: number): Promise<void> {
    await this.adminRequestRepository.update(requestId, { status: 'denied' });
  }
}
