import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRequestEntity } from './admin-request.entity';
import { AdminRequestService } from './admin-request.service';
import { AdminRequestController } from './admin-request.controller';
import { UserEntity } from '../database/entities/user.entity';
import { RoomEntity } from '../database/entities/room.entity';
import { RoomAdministratorEntity } from '../database/entities/room-administrator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRequestEntity, UserEntity, RoomEntity, RoomAdministratorEntity])],
  controllers: [AdminRequestController],
  providers: [AdminRequestService],
})
export class AdminRequestModule {}
