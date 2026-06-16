import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseRoomStatus, RoomEntity } from '../database/entities/room.entity';
import { NosqlService } from '../nosql/nosql.service';
import { GamingRoom, RoomStatus } from './room.model';

const ROOM_RELATIONS = { games: true, materials: true } as const;

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomsRepository: Repository<RoomEntity>,
    private readonly nosqlService: NosqlService,
  ) {}

  async findAll(): Promise<GamingRoom[]> {
    const rooms = await this.roomsRepository.find({
      relations: ROOM_RELATIONS,
      order: { name: 'ASC' },
    });

    return rooms.map((room) => this.toGamingRoom(room));
  }

  async findOne(id: number): Promise<GamingRoom> {
    const room = await this.findRoomEntity(id);
    const gamingRoom = this.toGamingRoom(room);

    await this.nosqlService.trackUsage({
      type: 'room_view',
      roomId: gamingRoom.id,
      roomName: gamingRoom.name,
      metadata: { city: gamingRoom.city },
    });

    return gamingRoom;
  }

  async findRoomEntity(id: number): Promise<RoomEntity> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ROOM_RELATIONS,
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  private toGamingRoom(room: RoomEntity): GamingRoom {
    return {
      id: room.id,
      name: room.name,
      city: this.extractCity(room.address),
      address: room.address,
      capacity: room.capacity,
      hourlyPrice: Number(room.hourlyRate),
      equipment: this.toSortedNames(room.materials),
      games: this.toSortedNames(room.games, 'title'),
      status: this.mapStatus(room.status),
      imageUrl: this.getImageUrl(room.id),
      description: room.description,
      latitude : room.latitude,
      longitude : room.longitude,
    };
  }

  private mapStatus(status: DatabaseRoomStatus): RoomStatus {
    if (status === 'maintenance') {
      return 'maintenance';
    }

    if (status === 'unavailable') {
      return 'reserved';
    }

    return 'available';
  }

  private extractCity(address: string): string {
    const parts = address.split(',').map((part) => part.trim()).filter(Boolean);

    return parts.at(-1) ?? 'Ville inconnue';
  }

  private getImageUrl(id: number): string {
    const imageIndex = ((id - 1) % 3) + 1;
    return `/assets/rooms/room-${imageIndex}.jpg`;
  }

  private toSortedNames<T extends { name?: string; title?: string }>(items: T[] | undefined, field: 'name' | 'title' = 'name'): string[] {
    return [...(items ?? [])]
      .map((item) => item[field])
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => a.localeCompare(b));
  }
}
