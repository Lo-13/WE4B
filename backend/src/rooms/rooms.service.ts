import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../database/entities/room.entity';
import { GamingRoom, RoomStatus } from './room.model';

const ROOM_RELATIONS = { games: true, materials: true } as const;
const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
];

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomsRepository: Repository<RoomEntity>,
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
    return this.toGamingRoom(room);
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
    };
  }

  private mapStatus(status: RoomEntity['status']): RoomStatus {
    if (status === 'maintenance') {
      return 'maintenance';
    }

    if (status === 'unavailable') {
      return 'reserved';
    }

    return 'available';
  }

  private extractCity(address: string): string {
    const postalCityMatch = address.match(/\b\d{5}\s+([^,]+)$/);

    if (postalCityMatch?.[1]) {
      return postalCityMatch[1].trim();
    }

    const parts = address.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : 'France';
  }

  private getImageUrl(roomId: number): string {
    return ROOM_IMAGES[roomId % ROOM_IMAGES.length];
  }

  private toSortedNames<T extends { name?: string; title?: string }>(items: T[] | undefined, key: 'name' | 'title' = 'name'): string[] {
    return [...(items ?? [])]
      .map((item) => item[key])
      .filter((value): value is string => Boolean(value))
      .sort();
  }
}
