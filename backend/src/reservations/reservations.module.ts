import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import { ReservationEntity } from '../database/entities/reservation.entity';
import { UserEntity } from '../database/entities/user.entity';
import { RoomsModule } from '../rooms/rooms.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [RoomsModule, TypeOrmModule.forFeature([ReservationEntity, CommentEntity, UserEntity])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
