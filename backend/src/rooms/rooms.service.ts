import { existsSync, renameSync } from 'node:fs';
import { extname, join } from 'node:path';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import { DatabaseRoomStatus, RoomEntity } from '../database/entities/room.entity';
import { NosqlService } from '../nosql/nosql.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GamingRoom, RoomReview, RoomStatus } from './room.model';

const ROOM_RELATIONS = { games: true, materials: true } as const;

type UploadedRoomFile = {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path?: string;
};

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomsRepository: Repository<RoomEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    private readonly nosqlService: NosqlService,
  ) {}

  async findAll(): Promise<GamingRoom[]> {
    const rooms = await this.roomsRepository.find({
      relations: ROOM_RELATIONS,
      order: { name: 'ASC' },
    });

    return Promise.all(rooms.map((room) => this.toGamingRoom(room)));
  }

  async findOne(id: number): Promise<GamingRoom> {
    const room = await this.findRoomEntity(id);
    const gamingRoom = await this.toGamingRoom(room);

    await this.nosqlService.trackUsage({
      type: 'room_view',
      roomId: gamingRoom.id,
      roomName: gamingRoom.name,
      metadata: { city: gamingRoom.city },
    });

    return gamingRoom;
  }

  async create(createRoomDto: CreateRoomDto, image?: UploadedRoomFile): Promise<GamingRoom> {
    const room = this.roomsRepository.create({
      name: this.requireText(createRoomDto.name, 'Room name is required'),
      address: this.requireText(createRoomDto.address, 'Room address is required'),
      capacity: this.toPositiveInteger(createRoomDto.capacity, 'Capacity must be greater than 0'),
      hourlyRate: this.toPositiveNumber(createRoomDto.hourlyPrice, 'Hourly price must be greater than 0'),
      description: this.requireText(createRoomDto.description, 'Description is required'),
      status: this.toRoomStatus(createRoomDto.status),
      latitude: this.toCoordinate(createRoomDto.latitude, 'Latitude is required'),
      longitude: this.toCoordinate(createRoomDto.longitude, 'Longitude is required'),
    });

    const savedRoom = await this.roomsRepository.save(room);
    const uploadedBy = this.toOptionalPositiveInteger(createRoomDto.uploadedBy);

    if (image) {
      const storedFileName = this.normalizeUploadedImageName(image);
      const publicUrl = this.getUploadedImageUrl(storedFileName);

      await this.nosqlService.createFileMetadata({
        fileName: image.originalname || image.filename,
        mimeType: image.mimetype,
        size: image.size,
        uploadedBy,
        linkedEntity: 'room',
        linkedEntityId: savedRoom.id,
        metadata: {
          storedFileName,
          publicUrl,
          roomName: savedRoom.name,
        },
      });
    }

    await this.nosqlService.logActivity({
      userId: uploadedBy,
      action: 'room_created',
      targetType: 'room',
      targetId: savedRoom.id,
      metadata: {
        roomName: savedRoom.name,
        hasImage: Boolean(image),
      },
    });

    return this.toGamingRoom(savedRoom);
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

  private async toGamingRoom(room: RoomEntity): Promise<GamingRoom> {
    const linkedImage = await this.nosqlService.findLatestFileForEntity('room', room.id);
    const storedFileName = linkedImage?.metadata?.['storedFileName'];
    const publicUrl = linkedImage?.metadata?.['publicUrl'];
    const reviews = await this.findRoomReviews(room.id);

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
      imageUrl: typeof publicUrl === 'string' && typeof storedFileName === 'string' && this.uploadedImageExists(storedFileName)
        ? publicUrl
        : this.getImageUrl(room.id),
      description: room.description,
      latitude: room.latitude,
      longitude: room.longitude,
      reviews,
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
    const cityPart = parts.length > 1 ? parts.at(-2) : parts.at(-1);
    const city = cityPart?.replace(/^\d{5}\s+/, '').trim();

    return city || 'Ville inconnue';
  }

  private getImageUrl(id: number): string {
    const imageIndex = ((id - 1) % 3) + 1;
    return `/assets/rooms/room-${imageIndex}.jpg`;
  }

  private getUploadedImageUrl(filename: string): string {
    const publicBackendUrl = process.env.PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

    return `${publicBackendUrl}/uploads/rooms/${filename}`;
  }

  private uploadedImageExists(filename: string): boolean {
    return existsSync(join(process.cwd(), 'uploads', 'rooms', filename));
  }

  private normalizeUploadedImageName(image: UploadedRoomFile): string {
    const extension = extname(image.originalname || '').toLowerCase();

    if (!image.path || !extension || image.filename.endsWith(extension)) {
      return image.filename;
    }

    const renamedFileName = `${image.filename}${extension}`;
    const renamedPath = `${image.path}${extension}`;

    renameSync(image.path, renamedPath);

    return renamedFileName;
  }

  private requireText(value: string | undefined, errorMessage: string): string {
    const text = value?.trim();

    if (!text) {
      throw new BadRequestException(errorMessage);
    }

    return text;
  }

  private toPositiveInteger(value: number | string, errorMessage: string): number {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      throw new BadRequestException(errorMessage);
    }

    return parsedValue;
  }

  private toOptionalPositiveInteger(value: number | string | undefined): number | undefined {
    if (value === undefined || value === '') {
      return undefined;
    }

    const parsedValue = Number(value);

    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
  }

  private toPositiveNumber(value: number | string, errorMessage: string): number {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      throw new BadRequestException(errorMessage);
    }

    return parsedValue;
  }

  private toCoordinate(value: number | string, errorMessage: string): number {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
      throw new BadRequestException(errorMessage);
    }

    return parsedValue;
  }

  private toRoomStatus(status: CreateRoomDto['status']): DatabaseRoomStatus {
    if (status === 'maintenance' || status === 'unavailable') {
      return status;
    }

    return 'available';
  }

  private async findRoomReviews(roomId: number): Promise<RoomReview[]> {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.reservation', 'reservation')
      .innerJoinAndSelect('comment.user', 'user')
      .where('reservation.roomId = :roomId', { roomId })
      .orderBy('comment.date', 'DESC')
      .limit(10)
      .getMany();

    return comments.map((comment) => ({
      id: comment.id,
      customerName: `${comment.user?.name ?? ''} ${comment.user?.lastName ?? ''}`.trim() || `Utilisateur ${comment.userId}`,
      rating: comment.rate,
      content: comment.content,
      date: this.formatDate(comment.date),
    }));
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private toSortedNames<T extends { name?: string; title?: string }>(items: T[] | undefined, field: 'name' | 'title' = 'name'): string[] {
    return [...(items ?? [])]
      .map((item) => item[field])
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => a.localeCompare(b));
  }
}
