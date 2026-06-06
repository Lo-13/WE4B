import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import { GameEntity } from '../database/entities/game.entity';
import { ReservationEntity } from '../database/entities/reservation.entity';
import { UserEntity } from '../database/entities/user.entity';
import { NosqlModule } from '../nosql/nosql.module';
import { RoomsModule } from '../rooms/rooms.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [RoomsModule, NosqlModule, TypeOrmModule.forFeature([ReservationEntity, CommentEntity, UserEntity, GameEntity])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
