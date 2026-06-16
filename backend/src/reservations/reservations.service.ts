import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import { GameEntity } from '../database/entities/game.entity';
import { ReservationEntity } from '../database/entities/reservation.entity';
import { UserEntity } from '../database/entities/user.entity';
import { NosqlService } from '../nosql/nosql.service';
import { RoomsService } from '../rooms/rooms.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-status.dto';
import { Reservation, ReservationStatus } from './reservation.model';

const RESERVATION_RELATIONS = { room: true, user: true, comments: true, payments: true } as const;
const RESERVATION_ORDER = { dateBegin: 'DESC' } as const;
const ACCEPTED_STATUSES: ReservationStatus[] = ['confirmed', 'pending', 'cancelled'];
const HOURS_TO_MS = 60 * 60 * 1000;

@Injectable()
export class ReservationsService {
  constructor(
    private readonly roomsService: RoomsService,
    @InjectRepository(ReservationEntity)
    private readonly reservationsRepository: Repository<ReservationEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(GameEntity)
    private readonly gamesRepository: Repository<GameEntity>,
    private readonly nosqlService: NosqlService,
  ) {}

  findAll(): Promise<Reservation[]> {
    return this.findMany();
  }

  findByUser(userId: number): Promise<Reservation[]> {
    return this.findMany({ userId });
  }

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const userId = this.toPositiveInteger(createReservationDto.userId, 'User id is required');
    const roomId = this.toPositiveInteger(createReservationDto.roomId, 'Room id is required');
    const room = await this.roomsService.findRoomEntity(roomId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const duration = Number(createReservationDto.duration);
    const playerCount = Number(createReservationDto.playerCount);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.validateReservationRequest(room.capacity, room.status, duration, playerCount);

    const selectedGameId = await this.resolveGameId(createReservationDto, room);

    const dateBegin = this.toDateTime(createReservationDto.startDate, createReservationDto.startTime);
    const dateEnd = new Date(dateBegin.getTime() + duration * HOURS_TO_MS);

    const savedReservation = await this.reservationsRepository.save(
      this.reservationsRepository.create({
        id: await this.getNextReservationId(),
        userId: user.id,
        roomId: room.id,
        gameId: selectedGameId,
        dateReservation: new Date(),
        dateBegin,
        dateEnd,
        nbPlayer: playerCount,
        totalPrice: Math.round(duration * Number(room.hourlyRate)),
        status: this.toDatabaseStatus('pending'),
      }),
    );

    const reservationDto = this.toCreatedReservationDto(savedReservation, user, room, duration);
    void this.logReservationCreated(user, room, reservationDto, playerCount, duration);

    return reservationDto;
  }

  private async logReservationCreated(
    user: UserEntity,
    room: Awaited<ReturnType<RoomsService['findRoomEntity']>>,
    reservationDto: Reservation,
    playerCount: number,
    duration: number,
  ): Promise<void> {
    try {
      await this.nosqlService.logActivity({
        userId: user.id,
        email: user.email,
        action: 'reservation_created',
        targetType: 'reservation',
        targetId: reservationDto.id,
        metadata: {
          roomId: room.id,
          roomName: room.name,
          playerCount,
          duration,
          totalPrice: reservationDto.totalPrice,
        },
      });
      await this.nosqlService.trackUsage({
        type: 'reservation_created',
        roomId: room.id,
        roomName: room.name,
        metadata: { playerCount, duration },
      });
    } catch {}
  }

  async addComment(id: number, addCommentDto: AddCommentDto): Promise<Reservation> {
    const reservation = await this.findEntity(id);

    if (this.mapStatus(reservation.status) !== 'confirmed') {
      throw new BadRequestException('Only confirmed reservations can be commented');
    }

    this.validateComment(addCommentDto);

    const existingComment = reservation.comments?.[0];
    const commentData = {
      rate: Number(addCommentDto.rating),
      content: addCommentDto.content.trim(),
      date: new Date(),
    };
    const comment = existingComment
      ? this.commentsRepository.merge(existingComment, commentData)
      : this.commentsRepository.create({
          ...commentData,
          userId: reservation.userId,
          reservationId: reservation.id,
          isValid: 0,
        });

    await this.commentsRepository.save(comment);

    const reservationDto = this.toReservationDto(await this.findEntity(id));
    await this.nosqlService.logActivity({
      userId: reservation.userId,
      action: existingComment ? 'comment_updated' : 'comment_created',
      targetType: 'reservation',
      targetId: reservation.id,
      metadata: { rating: addCommentDto.rating },
    });

    return reservationDto;
  }

  async updateStatus(id: number, updateStatusDto: UpdateReservationStatusDto): Promise<Pick<Reservation, 'id' | 'status'>> {
    if (!ACCEPTED_STATUSES.includes(updateStatusDto.status)) {
      throw new BadRequestException('Invalid reservation status');
    }

    const reservation = await this.findEntity(id);
    reservation.status = this.toDatabaseStatus(updateStatusDto.status);
    await this.reservationsRepository.save(reservation);
    await this.nosqlService.logActivity({
      userId: reservation.userId,
      action: 'reservation_status_updated',
      targetType: 'reservation',
      targetId: reservation.id,
      metadata: { status: updateStatusDto.status },
    });

    return {
      id: reservation.id,
      status: this.mapStatus(reservation.status),
    };
  }

  async cancel(id: number): Promise<Pick<Reservation, 'id' | 'status'>> {
    const reservation = await this.findEntity(id);
    reservation.status = this.toDatabaseStatus('cancelled');
    await this.reservationsRepository.save(reservation);
    await this.nosqlService.logActivity({
      userId: reservation.userId,
      action: 'reservation_cancelled',
      targetType: 'reservation',
      targetId: reservation.id,
    });

    return {
      id: reservation.id,
      status: 'cancelled',
    };
  }

  private async findMany(where?: FindOptionsWhere<ReservationEntity>): Promise<Reservation[]> {
    const reservations = await this.reservationsRepository.find({
      where,
      relations: RESERVATION_RELATIONS,
      order: RESERVATION_ORDER,
    });

    return reservations.map((reservation) => this.toReservationDto(reservation));
  }

  private async findEntity(id: number): Promise<ReservationEntity> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: RESERVATION_RELATIONS,
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  private toReservationDto(reservation: ReservationEntity): Reservation {
    const startDate = this.formatDate(reservation.dateBegin);
    const startTime = this.formatTime(reservation.dateBegin);
    const duration = Math.max(1, Math.round((reservation.dateEnd.getTime() - reservation.dateBegin.getTime()) / HOURS_TO_MS));
    const comment = reservation.comments?.[0];

    return {
      id: reservation.id,
      userId: reservation.userId,
      roomId: reservation.roomId,
      roomName: reservation.room?.name ?? `Room ${reservation.roomId}`,
      customerName: reservation.user ? `${reservation.user.name} ${reservation.user.lastName}`.trim() : `User ${reservation.userId}`,
      startDate,
      startTime,
      duration,
      playerCount: reservation.nbPlayer,
      totalPrice: Number(reservation.totalPrice),
      status: this.mapStatus(reservation.status),
      paymentStatus: this.hasCompletedPayment(reservation) ? 'paid' : 'pending',
      comment: comment
        ? {
            rating: comment.rate,
            content: comment.content,
            date: this.formatDate(comment.date),
          }
        : undefined,
    };
  }

  private async getNextReservationId(): Promise<number> {
    const result = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('MAX(reservation.id)', 'maxId')
      .getRawOne<{ maxId: number | string | null }>();

    return Number(result?.maxId ?? 0) + 1;
  }

  private toPositiveInteger(value: number | string, errorMessage: string): number {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      throw new BadRequestException(errorMessage);
    }

    return parsedValue;
  }

  private async resolveGameId(
    createReservationDto: CreateReservationDto,
    room: Awaited<ReturnType<RoomsService['findRoomEntity']>>,
  ): Promise<number> {
    const requestedGameId = Number(createReservationDto.gameId);

    if (requestedGameId > 0) {
      return requestedGameId;
    }

    const roomGameId = Number(room.games?.[0]?.id);

    if (roomGameId > 0) {
      return roomGameId;
    }

    const fallbackGame = await this.gamesRepository
      .createQueryBuilder('game')
      .orderBy('game.id', 'ASC')
      .getOne();

    if (!fallbackGame) {
      throw new BadRequestException('No game is available');
    }

    return fallbackGame.id;
  }

  private toCreatedReservationDto(
    reservation: ReservationEntity,
    user: UserEntity,
    room: Awaited<ReturnType<RoomsService['findRoomEntity']>>,
    duration: number,
  ): Reservation {
    return {
      id: reservation.id,
      userId: user.id,
      roomId: room.id,
      roomName: room.name,
      customerName: `${user.name} ${user.lastName}`.trim(),
      startDate: this.formatDate(reservation.dateBegin),
      startTime: this.formatTime(reservation.dateBegin),
      duration,
      playerCount: reservation.nbPlayer,
      totalPrice: Number(reservation.totalPrice),
      status: this.mapStatus(reservation.status),
      paymentStatus: 'pending',
    };
  }

  private validateReservationRequest(roomCapacity: number, roomStatus: string, duration: number, playerCount: number): void {
    if (roomStatus !== 'available') {
      throw new BadRequestException('Room is not available');
    }

    if (playerCount < 1 || playerCount > roomCapacity) {
      throw new BadRequestException('Player count exceeds room capacity');
    }

    if (duration < 1) {
      throw new BadRequestException('Duration must be greater than 0');
    }
  }

  private validateComment(addCommentDto: AddCommentDto): void {
    if (addCommentDto.rating < 1 || addCommentDto.rating > 10) {
      throw new BadRequestException('Rating must be between 1 and 10');
    }

    if (!addCommentDto.content?.trim()) {
      throw new BadRequestException('Comment content is required');
    }
  }

  private mapStatus(status: number): ReservationStatus {
    if (status === 1) {
      return 'confirmed';
    }

    if (status === 2) {
      return 'cancelled';
    }

    return 'pending';
  }

  private toDatabaseStatus(status: ReservationStatus): number {
    if (status === 'confirmed') {
      return 1;
    }

    if (status === 'cancelled') {
      return 2;
    }

    return 0;
  }

  private hasCompletedPayment(reservation: ReservationEntity): boolean {
    return reservation.payments?.some((payment) => payment.status === 'completed') ?? false;
  }

  private toDateTime(date: string, time: string): Date {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    return new Date(year, month - 1, day, hour, minute, 0);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}
