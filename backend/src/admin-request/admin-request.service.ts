import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRequestEntity } from './admin-request.entity';
import { AdminRequestDto } from './dto/admin-request.dto';
import { UserEntity } from '../database/entities/user.entity';
import { RoomEntity } from '../database/entities/room.entity';
import { RoomAdministratorEntity } from '../database/entities/room-administrator.entity';

export interface AdminRequestDetail {
  requestId: number;
  userId: number;
  userName: string;
  roomId: number;
  roomName: string;
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
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(RoomAdministratorEntity)
    private roomAdministratorRepository: Repository<RoomAdministratorEntity>,
  ) {}

  async create(dto: AdminRequestDto): Promise<AdminRequestEntity> {
    const newRequest = this.adminRequestRepository.create({
      userId: dto.userId,
      roomId: dto.roomId,
      status: 'pending' as const,
      createdDate: new Date(),
    });
    return this.adminRequestRepository.save(newRequest);
  }

  async findPending(): Promise<AdminRequestDetail[]> {
    return this.fetchWithDetails('pending');
  }

  async findAdmins(): Promise<{ userId: number; userName: string; roomId: number; roomName: string }[]> {
    const roomAdmins = await this.roomAdministratorRepository.find();
    const result: { userId: number; userName: string; roomId: number; roomName: string }[] = [];
    for (const ra of roomAdmins) {
      const user = await this.userRepository.findOne({ where: { id: ra.userId } });
      const room = await this.roomRepository.findOne({ where: { id: ra.roomId } });
      result.push({
        userId: ra.userId,
        userName: user ? `${user.name} ${user.lastName}` : 'Inconnu',
        roomId: ra.roomId,
        roomName: room?.name ?? 'Inconnue',
      });
    }
    return result;
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

  private async fetchWithDetails(status: 'pending' | 'accepted' | 'denied'): Promise<AdminRequestDetail[]> {
    const requests = await this.adminRequestRepository.find({ where: { status } });
    return Promise.all(
      requests.map(async (req) => {
        const user = await this.userRepository.findOne({ where: { id: req.userId } });
        const room = await this.roomRepository.findOne({ where: { id: req.roomId } });
        return {
          requestId: req.requestId,
          userId: req.userId,
          userName: user ? `${user.name} ${user.lastName}` : 'Inconnu',
          roomId: req.roomId,
          roomName: room?.name ?? 'Inconnue',
          status: req.status,
          createdDate: req.createdDate,
        };
      }),
    );
  }
}
